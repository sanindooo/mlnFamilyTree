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
  - sign-in-page
  - dashboard
  - profiles-api
symptoms:
  - "Account setup could not be completed. Please try signing in."
  - Profile API returns 404 after signup
  - User is actually logged in after page refresh
  - User must re-enter profile details after refresh
  - Step 2 profile save never executes
  - "Two-factor authentication is required. Please contact the administrator." on sign-in
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
- [ ] `strategy` parameter explicitly specified (e.g., `"password"`, `"ticket"`)?
- [ ] Status checked on the return value, NOT the hook state?
- [ ] `setActive()` called immediately after confirming `status === "complete"`?
- [ ] All React hooks called before any conditional `return` statements?
- [ ] `res.ok` checked on all fetch responses?
- [ ] Navigation/redirect conditional on API success?
- [ ] Error messages shown on all failure paths?

## Addendum 1: Sign-In Page Missing `strategy` Parameter (Superseded)

> **Note:** This fix was correct but insufficient. The `strategy: "password"` parameter was later found to be optional when `password` is provided (Clerk infers it). The real issue was **Client Trust** — see Addendum 2 below.

### Problem

After replacing the pre-built `<SignIn />` component with a custom form, the sign-in page returned the error:

> "Two-factor authentication is required. Please contact the administrator."

The user had not enabled 2FA in the Clerk dashboard.

### Initial Diagnosis (Incorrect)

The `signIn.create()` call was missing the `strategy` parameter. Adding `strategy: "password"` was expected to bypass the second factor requirement.

### Why It Didn't Work

The `strategy` parameter is optional when `password` is provided — Clerk infers the strategy from the presence of the `password` field. The `needs_second_factor` status was not caused by a missing strategy. It was caused by **Client Trust**, a Clerk security feature that triggers automatic second-factor verification on new/unrecognized devices. See Addendum 2.

---

## Addendum 2: Client Trust Triggers `needs_second_factor` on New Devices

### Problem

After all previous fixes, the sign-in page still returned:

> "Two-factor authentication is required. Please contact the administrator."

The user had **not** enabled 2FA. The `signIn.create()` call was correct. The `strategy: "password"` parameter was present.

### Root Cause: Clerk Client Trust

[Client Trust](https://clerk.com/docs/guides/secure/client-trust) is a Clerk security feature introduced on November 14, 2025, automatically enabled for all applications created after that date. It combats credential stuffing attacks.

**How it works:** When all of these conditions are met:
1. The user enters a **valid password**
2. The user has **NOT** enabled MFA/2FA on their account
3. The user is signing in from a **new/unrecognized device**

Clerk automatically requires a second-factor verification (email OTP), returning `status: "needs_second_factor"` with `email_code` as a supported strategy. This is not user-configured 2FA — it is a platform-level security measure.

**Why the previous code broke:** The sign-in form treated `needs_second_factor` as a terminal error:

```typescript
// BROKEN: dead-end error for a legitimate flow
} else if (result.status === "needs_second_factor") {
  toast.error("Two-factor authentication is required. Please contact the administrator.");
}
```

### Fix

Restructured the sign-in page into two sub-components:

1. **`CredentialsForm`** — email/password form. On `needs_second_factor`, prepares the second factor and transitions to the verification view.
2. **`VerificationForm`** — 6-digit email OTP form. Calls `signIn.attemptSecondFactor()` and completes the sign-in.

```typescript
// In CredentialsForm.onSubmit:
const result = await signIn.create({
  identifier: data.email,
  password: data.password,
});

if (result.status === "complete" && result.createdSessionId && setActive) {
  await setActive({ session: result.createdSessionId });
  router.push(redirectUrl);
} else if (result.status === "needs_second_factor") {
  // Client Trust or user-enabled MFA — prepare email code verification
  await signIn.prepareSecondFactor({ strategy: "email_code" });
  onNeedsVerification(data.email);
}
```

```typescript
// In VerificationForm.onSubmit:
const result = await signIn.attemptSecondFactor({
  strategy: "email_code",
  code: data.code,
});

if (result.status === "complete" && result.createdSessionId && setActive) {
  await setActive({ session: result.createdSessionId });
  router.push(redirectUrl);
}
```

The verification form includes:
- Envelope icon and "Check Your Email" heading (matches existing design language)
- User's email displayed so they know where to check
- 6-digit code input with `inputMode="numeric"` and `autoComplete="one-time-code"`
- "Resend code" button calling `signIn.prepareSecondFactor()` again
- "Back to sign in" link to return to the credentials form

### Also Changed

- Removed explicit `strategy: "password"` from `signIn.create()` — it is inferred from the `password` field per Clerk docs. The Clerk documentation examples for custom email/password forms pass only `identifier` and `password`.

### Clerk Documentation References

- [Build a Custom Email/Password Authentication Flow](https://clerk.com/docs/guides/development/custom-flows/authentication/email-password)
- [Build a Custom Sign-In Flow with MFA](https://clerk.com/docs/guides/development/custom-flows/authentication/email-password-mfa)
- [Client Trust Documentation](https://clerk.com/docs/guides/secure/client-trust)
- [Introducing Client Trust (Changelog, 2025-11-14)](https://clerk.com/changelog/2025-11-14-client-trust-credential-stuffing-killer)
- [SignIn Object JavaScript Reference](https://clerk.com/docs/reference/javascript/sign-in)
- [SignIn Second Factor Reference](https://clerk.com/docs/references/javascript/sign-in/second-factor)

### Affected Files

| File | Change |
|------|--------|
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Split into `CredentialsForm` + `VerificationForm`, handle `needs_second_factor` with email OTP flow |

---

## Related Documentation

- **Correct fix plan:** `docs/plans/2026-02-17-fix-signup-step2-status-check-plan.md`
- **Previous (incorrect) fix plan:** `docs/plans/2026-02-17-fix-signup-profile-race-condition-plan.md`
- **Architecture:** `docs/brainstorms/2026-02-17-database-and-custom-auth-brainstorm.md`
- **Auth setup:** `docs/plans/2026-02-17-feat-clerk-authentication-plan.md`

### All Affected Files (Cumulative)

| File | Change |
|------|--------|
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Handle Client Trust `needs_second_factor` with email OTP verification flow |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Capture return value, setActive in Step 1, simplify Step 2, fix hooks order |
| `src/app/(protected)/members/dashboard/page.tsx` | Strict empty string check (from previous fix, retained) |
| `src/app/api/profiles/me/route.ts` | No change (verified correct) |
| `src/app/api/webhooks/clerk/route.ts` | No change (verified correct) |
