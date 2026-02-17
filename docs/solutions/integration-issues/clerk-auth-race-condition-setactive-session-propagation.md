---
title: Signup Profile Save Race Condition in Next.js + Clerk Auth
date: 2026-02-17
category: integration-issues
tags:
  - clerk
  - authentication
  - race-condition
  - next-js
  - session-management
severity: high
modules:
  - sign-up-page
  - dashboard
  - webhook-handler
  - profiles-api
symptoms:
  - Profile data silently lost after invitation signup
  - User appears logged out immediately after signup
  - "User already exists" error on login attempt
  - Profile empty after refresh despite user being logged in
  - 401 on /api/profiles/me in server logs
root_cause_type: asynchronous-race-condition
---

# Clerk setActive() Session Propagation Race Condition

## Problem

After accepting an invitation and completing the 2-step signup flow, profile data entered in Step 2 (familyConnection, location, etc.) is silently lost. The user lands on the dashboard with an empty profile and a confusing auth state.

**Observable symptoms:**
- Profile save appears to succeed (no error shown) but data is empty on dashboard
- User appears logged out after signup completion
- Attempting to sign in again yields "user already exists" from Clerk
- Browser refresh shows user is actually logged in, but with an empty profile
- Server logs show `PUT /api/profiles/me` returning 401

## Root Cause

Three bugs compound into this broken experience:

### 1. Session cookie not propagated before API call

In `Step2Form.onSubmit`, `setActive({ session })` resolves before the Clerk session cookie is fully set in the browser. The immediate `fetch PUT /api/profiles/me` hits the API where server-side `auth()` returns `userId = null`, resulting in a 401 Unauthorized.

**Why:** Clerk's `setActive()` updates client-side state immediately but session cookies propagate asynchronously to the browser. Server-side `auth()` reads cookies, not client state.

### 2. API response never checked

The fetch only caught network errors (rejected promise). A 401 HTTP response was silently ignored because `res.ok` was never checked.

### 3. Unconditional redirect

`router.push("/members/dashboard")` ran regardless of whether the profile save succeeded, masking the failure.

**Additional complication:** Clerk's `user.created` webhook races with the client-side PUT. The webhook inserts a `user_profiles` row with empty `familyConnection` and `location`. If it fires before the PUT, the user ends up with a bare profile.

## Solution

### 1. Retry loop with backoff on 401 (Sign-Up Step 2)

**File:** `src/app/sign-up/[[...sign-up]]/page.tsx`

Replaced the single fire-and-forget fetch with a bounded retry loop that specifically handles 401 (session not ready):

```typescript
await setActive({ session: signUp.createdSessionId });

const payload = {
  fullName: `${signUp.firstName || ""} ${signUp.lastName || ""}`.trim(),
  ...data,
};

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 500;
let saved = false;

for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
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

    // Session cookie not propagated yet - wait and retry
    if (res.status === 401 && attempt < MAX_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      continue;
    }

    // Non-401 error, stop retrying
    break;
  } catch (error) {
    console.error(`Profile save attempt ${attempt + 1} failed:`, error);
  }
}

if (saved) {
  router.push("/members/dashboard");
} else {
  toast.error("Failed to save profile. Please try again.");
}
```

**Key decisions:**
- 5 attempts with 500ms delay (max ~2.5s wait) covers observed propagation times
- Only retries on 401, not other errors (prevents wasting attempts on real failures)
- Explicit `res.ok` check before treating as success
- Error toast + stays on form if all retries exhaust (user can retry manually)

### 2. Auto-skip to Step 2 on page refresh

**File:** `src/app/sign-up/[[...sign-up]]/page.tsx`

Added a `useEffect` to detect when Clerk's SDK state shows Step 1 already completed (e.g., user refreshed between steps):

```typescript
useEffect(() => {
  if (isLoaded && signUp?.status === "complete" && signUp.createdSessionId && step === 1) {
    setStep(2);
  }
}, [isLoaded, signUp?.status, signUp?.createdSessionId, step]);
```

Previously, `setStep(2)` was called during render, which is a React anti-pattern.

### 3. Strict skeleton profile detection (Dashboard)

**File:** `src/app/(protected)/members/dashboard/page.tsx`

Changed profile completion detection to use strict equality instead of falsy checks:

```typescript
// Webhook creates profiles with familyConnection and location as empty strings
setNeedsCompletion(data.familyConnection === "" && data.location === "");
```

This correctly identifies webhook-created skeleton profiles without false positives.

### What we didn't change

- **Webhook handler** (`src/app/api/webhooks/clerk/route.ts`): Already correct. `onConflictDoUpdate` only sets `{ fullName }`, never overwrites profile fields populated by Step 2.
- **PUT endpoint** (`src/app/api/profiles/me/route.ts`): Already correct. Upsert logic handles both create and update paths.

## Sequence Diagram

```
Step 1: signUp.create()  -->  Clerk creates user
                                     |
                          Clerk fires user.created webhook (async)
                                     |
Step 2: setActive()  ---+            v
                        |  Webhook: INSERT user_profiles (empty data)
   <-- cookie propagation delay -->
                        |
   fetch PUT /api/profiles/me (retry on 401)
         |
         v
   Check res.ok --> redirect only on success
```

## Prevention Strategies

### Rule 1: Never assume setActive() means cookie is ready

```typescript
// WRONG:
await setActive({ session: sessionId });
const res = await fetch("/api/protected"); // May get 401

// RIGHT:
await setActive({ session: sessionId });
// Use retry loop for subsequent authenticated API calls
```

### Rule 2: Always check res.ok before assuming success

```typescript
// WRONG:
const res = await fetch("/api/endpoint");
const data = await res.json(); // Processes error responses as success

// RIGHT:
const res = await fetch("/api/endpoint");
if (!res.ok) {
  toast.error("Request failed");
  return;
}
const data = await res.json();
```

### Code Review Checklist

For any auth-dependent fetch operations:

- [ ] `res.ok` checked before consuming response body?
- [ ] Non-2xx responses handled explicitly (not silently ignored)?
- [ ] `setActive()` calls followed by retry logic for protected endpoints?
- [ ] Retry only on 401, bounded max attempts?
- [ ] Navigation/redirect conditional on API success?
- [ ] Error messages shown to user on all failure paths?

## Related Documentation

- **Plan:** `docs/plans/2026-02-17-fix-signup-profile-race-condition-plan.md`
- **Architecture:** `docs/brainstorms/2026-02-17-database-and-custom-auth-brainstorm.md`
- **Auth setup:** `docs/plans/2026-02-17-feat-clerk-authentication-plan.md`

### Affected Files

| File | Change |
|------|--------|
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Retry loop, useEffect auto-skip |
| `src/app/(protected)/members/dashboard/page.tsx` | Strict empty string check |
| `src/app/api/profiles/me/route.ts` | No change (verified correct) |
| `src/app/api/webhooks/clerk/route.ts` | No change (verified correct) |
