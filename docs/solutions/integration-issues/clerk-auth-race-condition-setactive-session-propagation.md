---
title: "Clerk Invitation Signup: Complete Fix History — From Stale Hook State to setActive() Redirect Race"
date: 2026-02-17
category: integration-issues
tags:
  - clerk
  - authentication
  - signup
  - next-js
  - react-hooks
  - state-management
  - race-condition
  - useref
severity: high
modules:
  - sign-up-page
  - sign-in-page
  - dashboard
  - profiles-api
symptoms:
  - "Account setup could not be completed. Please try signing in."
  - Step 2 profile form completely skipped after account creation
  - "Welcome Back" sign-in form shown to authenticated users
  - Profile API returns 404 after signup
  - User must refresh multiple times to see members directory
  - Profile data lost, must be re-entered
root_cause_type: state-management-error
supersedes: "Previous analysis blamed setActive() cookie propagation race condition (incorrect)"
---

# Clerk Invitation Signup — Complete Fix History

This document covers the full debugging history of the 2-step invitation signup flow. Three rounds of fixes were needed because each fix exposed a deeper issue.

## Timeline

| Round | Symptom | Root Cause | Fix |
|-------|---------|-----------|-----|
| 1 | Profile save fails silently | Misdiagnosed as `setActive()` cookie propagation delay | Retry loop on 401 (incorrect) |
| 2 | "Account setup could not be completed" toast | `signUp.create()` return value discarded; stale hook state | Capture return value; call `setActive()` in Step 1 |
| 3 | Step 2 skipped entirely; sign-in page shown to auth users | `isSignedIn` redirect fires before Step 2 renders; React `setState` race | `useRef` synchronous guard; sign-in auth guard |

---

## Round 1: Retry Loop (Incorrect Diagnosis)

**Symptom:** Profile data silently lost after signup. 401 errors in server logs.

**Misdiagnosed cause:** `setActive()` resolves before session cookie propagates to the server.

**Fix attempted:** Retry loop on 401 in Step 2:
```typescript
for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
  const res = await fetch("/api/profiles/me", { method: "PUT", ... });
  if (res.ok) break;
  if (res.status === 401) await delay(500);
}
```

**Why it didn't work:** The code never reached the retry loop. The `signUp?.status === "complete"` guard evaluated to `false` (stale hook state), so the `else` branch fired immediately.

---

## Round 2: Capture Return Value

**Symptom:** Toast error "Account setup could not be completed. Please try signing in."

**Root cause:** `signUp.create()` return value was discarded. Step 2 read `signUp?.status` from the `useSignUp()` hook, which hadn't re-rendered yet.

**Fix:**
1. Capture `signUp.create()` return value and check `result.status`
2. Call `setActive()` in Step 1 (not Step 2)
3. Simplify Step 2 to just a profile save (user already authenticated)
4. Fix React Rules of Hooks violation (hooks before conditional returns)

**This worked** — but exposed a new bug.

---

## Round 3: setActive() Redirect Race (Current Fix)

**Symptom:** After Step 1 completes, Step 2 (profile form) is completely skipped. User lands on dashboard without completing profile. Sign-in page shows "Welcome Back" to authenticated users.

### Root Cause

After calling `setActive()` in Step 1, Clerk updates `isSignedIn` to `true`. Two guards in `InvitationSignUp` fire before Step 2 can render:

```typescript
// Guard 1: useEffect redirect
useEffect(() => {
  if (isSignedIn) {                        // true after setActive()
    router.push("/members/dashboard");      // fires before Step 2 renders
  }
}, [isSignedIn, router]);

// Guard 2: render guard
if (isSignedIn) return null;               // prevents Step 2 from mounting
```

**Why React `setState` alone doesn't work:** A `completingProfile` state flag loses the race:

```
setCompletingProfile(true)  ← queued by React, not yet committed
setActive(...)              ← Clerk updates isSignedIn synchronously
→ useEffect fires: completingProfile still false (old value)
→ router.push fires ← wrong
```

### Solution

#### 1. `useRef` for synchronous race-proof guard

The ref is set **before** `setActive()`, so it's already `true` when the redirect effect evaluates:

```typescript
const completingProfileRef = useRef(false);
const [completingProfile, setCompletingProfile] = useState(false);

// useEffect reads the ref (synchronous, wins the race)
useEffect(() => {
  if (isSignedIn && !completingProfileRef.current) {
    router.push("/members/dashboard");
  }
}, [isSignedIn, router]);

// Render guard uses state (for React re-render control)
if (isSignedIn && !completingProfile) return null;
```

#### 2. `onBeforeActivate` sets both ref and state BEFORE `setActive()`

```typescript
onBeforeActivate={() => {
  completingProfileRef.current = true; // synchronous — wins the race
  setCompletingProfile(true);          // for render guard
}}
```

#### 3. `onActivationFailed` resets flag if `setActive()` throws

```typescript
if (result.status === "complete" && result.createdSessionId && setActive) {
  onBeforeActivate();
  try {
    await setActive({ session: result.createdSessionId });
  } catch (activationErr) {
    onActivationFailed(); // reset ref + state so redirect guard works again
    throw activationErr;
  }
  onComplete(data.firstName, data.lastName);
}
```

#### 4. Store firstName/lastName in parent state

The `signUp` object from `useSignUp()` may be cleared after `setActive()`. Store name in parent:

```typescript
const [userName, setUserName] = useState({ firstName: "", lastName: "" });

// Step1Form passes name up via callback
onComplete={(firstName, lastName) => {
  setUserName({ firstName, lastName });
  setStep(2);
}}

// Step2Form receives name as prop, not from signUp hook
<Step2Form userName={userName} ... />
```

#### 5. Sign-in page auth guard

Prevents "Welcome Back" form from showing to authenticated users:

```typescript
const { isSignedIn } = useUser();

useEffect(() => {
  if (isLoaded && isSignedIn) {
    router.push(redirectUrl);
  }
}, [isLoaded, isSignedIn, router, redirectUrl]);

if (!isLoaded) return null;
if (isSignedIn) return null;
```

#### 6. Hardened open redirect validation

```typescript
const ALLOWED_PREFIXES = ["/members", "/admin"];
if (!rawRedirect.startsWith("/") || rawRedirect.startsWith("//")) return fallback;
const decoded = decodeURIComponent(rawRedirect);
if (decoded.startsWith("//") || decoded.includes("\\")) return fallback;
return ALLOWED_PREFIXES.some((p) => rawRedirect.startsWith(p)) ? rawRedirect : fallback;
```

#### 7. Distinguish 401 in Step 2

```typescript
if (res.ok) {
  router.push("/members/dashboard");
} else if (res.status === 401) {
  toast.error("Your session expired. Please sign in again.");
  router.push("/sign-in");
} else {
  toast.error("Failed to save profile. Please try again.");
}
```

### What we didn't change

- **Webhook handler** (`src/app/api/webhooks/clerk/route.ts`): Already correct.
- **PUT endpoint** (`src/app/api/profiles/me/route.ts`): Already correct.
- **Dashboard** (`src/app/(protected)/members/dashboard/page.tsx`): `ProfileCompletionForm` serves as recovery path if user refreshes during Step 2.

## Sequence Diagram (Final)

```
Step 1: signUp.create() → result.status === "complete"
         |
   completingProfileRef.current = true  ← synchronous, before setActive
   setCompletingProfile(true)           ← for render guard
         |
   await setActive({ session })  ← isSignedIn becomes true
         |
   useEffect fires: completingProfileRef.current === true → NO redirect
   render guard: completingProfile === true → Step 2 renders
         |
   onComplete(firstName, lastName) → setStep(2)
         |
Step 2: PUT /api/profiles/me with userName from parent state
         |
   res.ok? → router.push("/members/dashboard")
```

## Prevention Strategies

### Rule 1: Use useRef for synchronous guards against async state changes

```typescript
// WRONG: setState loses the race against external state updates
setFlag(true);                    // queued, not committed
await externalAsyncOperation();   // triggers isSignedIn = true
// useEffect reads flag === false ← stale

// RIGHT: useRef is synchronous
flagRef.current = true;           // committed immediately
await externalAsyncOperation();   // triggers isSignedIn = true
// useEffect reads flagRef.current === true ← correct
```

### Rule 2: Always use the return value of Clerk SDK mutation methods

```typescript
// WRONG: reads stale hook state
await signUp.create({ strategy: "ticket", ... });
if (signUp.status === "complete") { ... } // stale!

// RIGHT: use the return value
const result = await signUp.create({ strategy: "ticket", ... });
if (result.status === "complete") { ... } // fresh!
```

### Rule 3: Store derived data in parent state when child hooks may be cleared

Don't read `signUp?.firstName` in Step 2 after `setActive()` has been called — the hook may be cleared. Store values in parent state during Step 1 and pass as props.

### Rule 4: Always reset flags on error paths

```typescript
onBeforeActivate();
try {
  await setActive({ session });
} catch (err) {
  onActivationFailed(); // reset ref + state
  throw err;
}
```

### Rule 5: React hooks before conditional returns

```typescript
useEffect(() => { ... }); // hooks first
if (condition) return null; // conditional returns after
```

### Rule 6: Hardened open redirect with allowlist

Define trusted prefixes. Decode and validate. Block `//`, `\`, and encoded variants.

### Code Review Checklist

For Clerk SDK + multi-step auth flows:

- [ ] `signUp.create()` / `signIn.create()` return value captured and used?
- [ ] Status checked on the return value, NOT the hook state?
- [ ] `setActive()` called immediately after confirming `status === "complete"`?
- [ ] `useRef` guard set synchronously BEFORE `setActive()` call?
- [ ] Both ref AND state guards check the flag?
- [ ] Flag reset on `setActive()` failure (try/catch)?
- [ ] Form data stored in parent state, not read from hooks after `setActive()`?
- [ ] All React hooks called before any conditional `return` statements?
- [ ] `res.ok` checked on all fetch responses?
- [ ] 401 distinguished from generic errors?
- [ ] Redirect URL validated with allowlist approach?
- [ ] Sign-in/sign-up pages guard against already-authenticated users?

## Related Documentation

- **Round 3 fix plan:** `docs/plans/2026-02-17-fix-post-signup-auth-state-bugs-plan.md`
- **Round 2 fix plan:** `docs/plans/2026-02-17-fix-signup-step2-status-check-plan.md`
- **Round 1 fix plan (superseded):** `docs/plans/2026-02-17-fix-signup-profile-race-condition-plan.md`
- **Architecture:** `docs/brainstorms/2026-02-17-database-and-custom-auth-brainstorm.md`
- **Auth setup:** `docs/plans/2026-02-17-feat-clerk-authentication-plan.md`

### Affected Files

| File | Change |
|------|--------|
| `src/app/sign-up/[[...sign-up]]/page.tsx` | useRef guard, completingProfile flag, userName in parent state, onBeforeActivate/onActivationFailed callbacks |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | isSignedIn guard, useForm hooks order fix, hardened open redirect |
| `.env.local` / `.env.example` | Fallback redirect URLs → `/members/dashboard` |
| `src/app/(protected)/members/dashboard/page.tsx` | Strict empty string check (from Round 1, retained) |
| `src/app/api/profiles/me/route.ts` | No change (verified correct) |
| `src/app/api/webhooks/clerk/route.ts` | No change (verified correct) |
