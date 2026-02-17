---
title: "fix: Signup Step 2 fails because signUp.create() return value is discarded"
type: fix
status: completed
date: 2026-02-17
---

# fix: Signup Step 2 fails because signUp.create() return value is discarded

After entering details in the 2-step signup form, the user sees "Account setup could not be completed. Please try signing in." The profile API returns 404 on the dashboard. After refreshing, the user is actually logged in but has to re-enter profile details.

## Root Cause

**The previous fix was targeting the wrong problem.** The code never reaches the retry loop.

In `Step1Form.onSubmit` (line 322-331), `signUp.create()` is called but the **return value is discarded**:

```typescript
await signUp.create({ strategy: "ticket", ticket, ... });
onComplete(); // unconditionally advances to Step 2
```

Then in `Step2Form.onSubmit` (line 431), it checks:

```typescript
if (signUp?.status === "complete" && signUp.createdSessionId && setActive) {
```

This reads `signUp` from the `useSignUp()` hook — but the hook state **hasn't re-rendered yet** after `create()`. So `signUp.status` is still its pre-create value, the condition is `false`, and the `else` branch fires:

```typescript
toast.error("Account setup could not be completed. Please try signing in.");
router.push("/sign-in");
```

The PUT `/api/profiles/me` is never called. The 404 the user sees is from `GET /api/profiles/me` on the dashboard (the webhook skeleton hasn't arrived yet or the profile is empty).

**Clerk's own docs confirm**: use the return value of `signUp.create()`, not the hook state:

```typescript
const signUpAttempt = await signUp.create({ strategy: 'ticket', ... });
if (signUpAttempt.status === 'complete') {
  await setActive({ session: signUpAttempt.createdSessionId });
}
```

**Additional bug:** There's a React Rules of Hooks violation — `useEffect` (line 218) is called after a conditional `return` (line 212-215).

## Acceptance Criteria

- [x]`signUp.create()` return value is captured and used to check status
- [x]`setActive()` is called in Step 1 after confirming `status === "complete"`, so the user is authenticated before Step 2
- [x]Step 2 is a simple authenticated profile-save form (no `signUp.status` check needed)
- [x]The 401 retry loop is removed (user is already authenticated from Step 1)
- [x]React hooks are called before any conditional returns (Rules of Hooks compliance)
- [x]Non-"complete" statuses from `signUp.create()` are handled with a clear error message
- [x]Profile data from Step 2 is saved to the database
- [x]User is redirected to dashboard only after successful profile save

## Fix

### 1. `src/app/sign-up/[[...sign-up]]/page.tsx` — InvitationSignUp component

Move all hooks before conditional returns:

```typescript
function InvitationSignUp({ ticket }: { ticket: string }) {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  // Hook BEFORE conditional returns
  useEffect(() => {
    if (isSignedIn) {
      router.push("/members/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) return null;
  if (isSignedIn) return null; // safe — hooks already called above
  // ...
}
```

### 2. `src/app/sign-up/[[...sign-up]]/page.tsx` — Step1Form.onSubmit

Capture return value, call `setActive()` here, then advance to Step 2:

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

    if (result.status === "complete" && result.createdSessionId) {
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

**Key change:** `setActive` must be passed to `Step1Form` as a prop.

### 3. `src/app/sign-up/[[...sign-up]]/page.tsx` — Step2Form.onSubmit

Simplified — user is already authenticated, just save the profile:

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

No `signUp.status` check. No `setActive()` call. No retry loop. The session is already active from Step 1.

### 4. Remove the stale `useEffect` auto-skip

The `useEffect` at line 218-222 that tried to auto-skip to Step 2 is no longer needed and can be removed — `setActive` now happens in Step 1.

## Context

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

## References

- `src/app/sign-up/[[...sign-up]]/page.tsx:322-331` — Step1Form.onSubmit (primary fix)
- `src/app/sign-up/[[...sign-up]]/page.tsx:426-485` — Step2Form.onSubmit (simplify)
- `src/app/sign-up/[[...sign-up]]/page.tsx:212-222` — Hooks violation + stale useEffect
- `src/app/sign-in/[[...sign-in]]/page.tsx:48-55` — Sign-in does it correctly (reference pattern)
- Clerk docs: invitation flow uses return value of `signUp.create()`
- Previous fix: `docs/plans/2026-02-17-fix-signup-profile-race-condition-plan.md` (targeted wrong issue)
