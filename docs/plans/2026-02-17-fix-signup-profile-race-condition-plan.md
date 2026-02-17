---
title: "fix: Signup profile save race condition"
type: fix
status: completed
date: 2026-02-17
---

# fix: Signup profile save race condition

After accepting an invitation and completing the 2-step signup, the profile data entered in Step 2 (familyConnection, location, etc.) is silently lost. The user lands on the dashboard with an empty profile and a confusing auth state.

## Root Cause

Three bugs compound into this broken experience:

1. **Session not propagated before API call** — In `Step2Form.onSubmit` (`src/app/sign-up/[[...sign-up]]/page.tsx:425-426`), `setActive({ session })` resolves before the Clerk session cookie is fully set in the browser. The immediate `fetch PUT /api/profiles/me` (line 430) hits the API where `auth()` returns `userId = null`, resulting in a **401 Unauthorized**.

2. **API response never checked** — The fetch at line 429-437 only catches *network errors* (rejected promise). A 401 HTTP response is silently ignored because `res.ok` is never checked. The profile data is never saved.

3. **Webhook creates empty profile** — Clerk's `user.created` webhook (`src/app/api/webhooks/clerk/route.ts:13-30`) races with the client-side PUT. It inserts a `user_profiles` row with empty `familyConnection` and `location`. If it fires before the PUT, the user ends up with a bare profile. If it fires after, its `onConflictDoUpdate` overwrites only `fullName`, preserving whatever data exists — but by then the PUT already failed silently.

**Result:** User is redirected to dashboard (line 442 runs unconditionally), sees empty profile or "complete your profile" form, thinks signup failed, tries to sign in again, gets "user already exists" from Clerk.

## Acceptance Criteria

- [x] Profile data from Step 2 (familyConnection, location, aboutMe, interests, profession) is reliably saved to the database after signup
- [x] If the profile save fails, the user sees a clear error message and is NOT redirected away from the form
- [x] The webhook's `onConflictDoUpdate` does not overwrite Step 2 profile data with empty strings
- [x] Dashboard loads correctly after signup without requiring a manual refresh

## Fix

### 1. `src/app/sign-up/[[...sign-up]]/page.tsx` — Step2Form.onSubmit

Replace lines 423-446 with a pattern that waits for session readiness, checks the response, retries once, and only redirects on success:

```typescript
// Activate the session
if (signUp?.status === "complete" && signUp.createdSessionId && setActive) {
  await setActive({ session: signUp.createdSessionId });

  // Wait for session cookie to propagate
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const payload = {
    fullName: `${signUp.firstName || ""} ${signUp.lastName || ""}`.trim(),
    ...data,
  };

  let saved = false;

  // Attempt to save profile (retry once if auth not ready)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch("/api/profiles/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        saved = true;
        break;
      }

      // If 401, session likely not propagated yet — wait and retry
      if (res.status === 401 && attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
    } catch {
      // Network error — will retry or fall through
    }
  }

  if (saved) {
    router.push("/members/dashboard");
  } else {
    toast.error("Failed to save profile. Please try again.");
  }
} else {
  toast.error("Account setup could not be completed. Please try signing in.");
  router.push("/sign-in");
}
```

### 2. `src/app/api/webhooks/clerk/route.ts` — Protect existing profile data

Change the `onConflictDoUpdate` (line 27-29) so the webhook does not overwrite profile fields that were already populated by Step 2:

```typescript
.onConflictDoUpdate({
  target: userProfiles.clerkUserId,
  set: { fullName },  // Only update fullName, never overwrite familyConnection/location
})
```

This is actually already correct — the webhook only sets `fullName` on conflict. No change needed here.

### 3. `src/app/(protected)/members/dashboard/page.tsx` — Handle incomplete profiles

The dashboard already handles both cases (200 with profile, 404 without). The profile completion form at line 724-827 uses `PUT /api/profiles/me` with proper `res.ok` checking. No change needed here.

## Context

```
Step 1: signUp.create()  ──→  Clerk creates user
                                     │
                          Clerk fires user.created webhook (async)
                                     │
Step 2: setActive()  ───┐            ▼
                        │  Webhook: INSERT user_profiles (empty data)
   ← wait for cookie →  │
                        │
   fetch PUT /api/profiles/me  ──→  UPSERT with full Step 2 data
         │
         ▼
   Check res.ok → redirect only on success
```

## References

- `src/app/sign-up/[[...sign-up]]/page.tsx:419-452` — Step2Form.onSubmit (primary fix location)
- `src/app/api/profiles/me/route.ts:56-88` — PUT handler (upsert logic)
- `src/app/api/webhooks/clerk/route.ts:9-50` — Clerk webhook handler
- `src/app/(protected)/members/dashboard/page.tsx:33-47` — Dashboard profile fetch
- `src/proxy.ts` — Clerk middleware (protects `/members/*` but not `/api/*`)
