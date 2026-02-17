---
title: "Signup Step 2 Fails: signUp.create() Return Value Discarded, Stale Hook State"
date: 2026-02-17
category: integration-issues
tags:
  - clerk
  - authentication
  - signup
  - next-js
  - react-hooks
  - state-management
severity: high
modules:
  - sign-up-page
  - dashboard
  - profiles-api
symptoms:
  - "Account setup could not be completed. Please try signing in."
  - Profile API returns 404 after signup
  - User is actually logged in after page refresh
  - User must re-enter profile details after refresh
  - Step 2 profile save never executes
root_cause_type: state-management-error
supersedes: "Previous analysis blamed setActive() cookie propagation race condition (incorrect)"
---

# Clerk signUp.create() Return Value Discarded — Stale Hook State Breaks Step 2

## Problem

After accepting an invitation and completing the 2-step signup form, the user sees:

> "Account setup could not be completed. Please try signing in."

The profile API `/api/profiles/me` returns 404 on the dashboard. After refreshing, the user is actually logged in but has to re-enter profile details.

**Observable symptoms:**
- Toast error: "Account setup could not be completed. Please try signing in."
- Redirected to `/sign-in` after completing Step 2
- `/api/profiles/me` returns 404 on dashboard (profile never saved)
- Page refresh reveals user IS authenticated (Clerk session exists)
- Profile details must be re-entered manually

## What Didn't Work (Previous Fix)

The first fix assumed the problem was a `setActive()` session cookie propagation race condition causing 401s on the profile PUT. A retry loop with backoff was added to Step 2:

```typescript
// PREVIOUS FIX (incorrect diagnosis):
// Retry loop on 401 in Step2Form.onSubmit
for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
  const res = await fetch("/api/profiles/me", { method: "PUT", ... });
  if (res.ok) break;
  if (res.status === 401) await delay(500); // retry
}
```

**Why it didn't work:** The code never reached the retry loop. The `signUp?.status === "complete"` condition guarding the entire block evaluated to `false`, so the `else` branch fired immediately with the error toast.

## Root Cause

Two bugs compounded into the broken experience:

### 1. signUp.create() return value discarded (primary cause)

In `Step1Form.onSubmit`, `signUp.create()` was called but the return value was thrown away:

```typescript
// BROKEN: return value discarded
await signUp.create({ strategy: "ticket", ticket, ... });
onComplete(); // unconditionally advances to Step 2
```

Then in `Step2Form.onSubmit`, the code checked:

```typescript
if (signUp?.status === "complete" && signUp.createdSessionId && setActive) {
```

This reads `signUp` from the `useSignUp()` hook — but React hasn't re-rendered yet after `create()`. The hook state is still its pre-create value. The condition is `false`, and the `else` branch fires:

```typescript
toast.error("Account setup could not be completed. Please try signing in.");
router.push("/sign-in");
```

**Clerk's own docs confirm:** use the return value of `signUp.create()`, not the hook state:

```typescript
const signUpAttempt = await signUp.create({ strategy: 'ticket', ... });
if (signUpAttempt.status === 'complete') {
  await setActive({ session: signUpAttempt.createdSessionId });
}
```

The sign-in page in this same codebase (`src/app/sign-in/[[...sign-in]]/page.tsx:48-55`) already follows this pattern correctly.

### 2. React Rules of Hooks violation

`useEffect` was called after a conditional `return` statement:

```typescript
// BROKEN: hook after conditional return
if (isSignedIn) {
  return null; // early return
}

useEffect(() => { ... }, [...]); // Rules of Hooks violation
```

React requires all hooks to be called in the same order on every render. Conditional returns before hooks can cause unpredictable behavior.

## Solution

### 1. Fix React hooks order (`InvitationSignUp` component)

Moved all hooks before conditional returns:

```typescript
function InvitationSignUp({ ticket }: { ticket: string }) {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);

  // Hook BEFORE conditional returns
  useEffect(() => {
    if (isSignedIn) {
      router.push("/members/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) return null;
  if (isSignedIn) return null; // safe — hooks already called
  // ...
}
```

### 2. Capture return value and call setActive in Step 1

Pass `setActive` to `Step1Form` as a prop. Capture `signUp.create()` return value and use it:

```typescript
const onSubmit = async (data: Step1Input) => {
  if (!isLoaded || !signUp) return;
  setIsSubmitting(true);

  try {
    const result = await signUp.create({
      strategy: "ticket",
      ticket,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });

    if (result.status === "complete" && result.createdSessionId && setActive) {
      await setActive({ session: result.createdSessionId });
      onComplete(); // advance to Step 2 — user is now authenticated
    } else {
      toast.error("Additional verification may be required. Please contact the administrator.");
    }
  } catch (err) {
    // existing error handling
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3. Simplify Step 2 to just a profile save

User is already authenticated from Step 1. No `signUp.status` check, no `setActive()` call, no retry loop:

```typescript
const onSubmit = async (data: Step2Input) => {
  setIsSubmitting(true);

  try {
    const payload = {
      fullName: `${signUp?.firstName || ""} ${signUp?.lastName || ""}`.trim(),
      ...data,
    };

    const res = await fetch("/api/profiles/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/members/dashboard");
    } else {
      toast.error("Failed to save profile. Please try again.");
    }
  } catch {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
```

### What we didn't change

- **Webhook handler** (`src/app/api/webhooks/clerk/route.ts`): Already correct. `onConflictDoUpdate` only sets `{ fullName }`.
- **PUT endpoint** (`src/app/api/profiles/me/route.ts`): Already correct. Upsert handles both create and update.
- **Dashboard** (`src/app/(protected)/members/dashboard/page.tsx`): Strict `=== ""` check for skeleton profiles (from previous fix, still correct).

## Sequence Diagram

```
Step 1: signUp.create()
         |
         v
   result.status === "complete"?
         |
    YES: setActive({ session: result.createdSessionId })
         |
         v
   onComplete() → step = 2
         |
Step 2: fetch PUT /api/profiles/me (user is already authenticated)
         |
         v
   res.ok? → router.push("/members/dashboard")
```

## Prevention Strategies

### Rule 1: Always use the return value of Clerk SDK mutation methods

```typescript
// WRONG: reads stale hook state
await signUp.create({ strategy: "ticket", ... });
if (signUp.status === "complete") { ... } // stale!

// RIGHT: use the return value
const result = await signUp.create({ strategy: "ticket", ... });
if (result.status === "complete") { ... } // fresh!
```

This applies to `signUp.create()`, `signIn.create()`, `signUp.attemptVerification()`, and similar methods. The `useSignUp()`/`useSignIn()` hook state updates asynchronously on the next React render cycle.

### Rule 2: Call setActive() as early as possible

Don't defer `setActive()` to a later step. Call it immediately after confirming signup/signin is complete:

```typescript
const result = await signUp.create({ ... });
if (result.status === "complete" && result.createdSessionId) {
  await setActive({ session: result.createdSessionId });
  // NOW the user is authenticated for subsequent API calls
}
```

### Rule 3: React hooks before conditional returns

```typescript
// WRONG:
if (condition) return null;
useEffect(() => { ... }); // Rules of Hooks violation

// RIGHT:
useEffect(() => { ... }); // hooks first
if (condition) return null; // conditional returns after
```

### Code Review Checklist

For Clerk SDK integration:

- [ ] `signUp.create()` / `signIn.create()` return value captured and used?
- [ ] Status checked on the return value, NOT the hook state?
- [ ] `setActive()` called immediately after confirming `status === "complete"`?
- [ ] All React hooks called before any conditional `return` statements?
- [ ] `res.ok` checked on all fetch responses?
- [ ] Navigation/redirect conditional on API success?
- [ ] Error messages shown on all failure paths?

## Related Documentation

- **Correct fix plan:** `docs/plans/2026-02-17-fix-signup-step2-status-check-plan.md`
- **Previous (incorrect) fix plan:** `docs/plans/2026-02-17-fix-signup-profile-race-condition-plan.md`
- **Architecture:** `docs/brainstorms/2026-02-17-database-and-custom-auth-brainstorm.md`
- **Auth setup:** `docs/plans/2026-02-17-feat-clerk-authentication-plan.md`
- **Reference pattern:** `src/app/sign-in/[[...sign-in]]/page.tsx:48-55` (sign-in uses return value correctly)

### Affected Files

| File | Change |
|------|--------|
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Capture return value, setActive in Step 1, simplify Step 2, fix hooks order |
| `src/app/(protected)/members/dashboard/page.tsx` | Strict empty string check (from previous fix, retained) |
| `src/app/api/profiles/me/route.ts` | No change (verified correct) |
| `src/app/api/webhooks/clerk/route.ts` | No change (verified correct) |
