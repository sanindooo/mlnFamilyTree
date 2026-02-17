---
title: "fix: Post-signup auth state bugs — Step 2 skipped, members page shows sign-in"
type: fix
status: completed
date: 2026-02-17
---

# fix: Post-signup auth state bugs — Step 2 skipped, members page shows sign-in

After the previous fix (capturing `signUp.create()` return value), calling `setActive()` in Step 1 causes `isSignedIn` to become `true` immediately. This triggers the redirect guard and `return null`, completely skipping Step 2. The members page also intermittently shows the sign-in form to authenticated users.

## Root Cause

### Bug 1: Step 2 skipped after signup

In `InvitationSignUp` (line 211-219), two guards fire when `isSignedIn` becomes `true`:

```typescript
// Guard 1: useEffect redirect
useEffect(() => {
  if (isSignedIn) {
    router.push("/members/dashboard"); // fires immediately after setActive()
  }
}, [isSignedIn, router]);

// Guard 2: render guard
if (isSignedIn) return null; // prevents Step 2 from rendering
```

After Step 1 calls `await setActive()`, Clerk updates `isSignedIn` to `true` on the next render. Both guards fire before `setStep(2)` has any visible effect — the user is redirected to the dashboard without ever seeing the profile form.

### Bug 2: Sign-in page shows to authenticated users

The sign-in page (`src/app/sign-in/[[...sign-in]]/page.tsx`) has no `isSignedIn` guard. When middleware redirects to `/sign-in` during session cookie propagation delays, or when an authenticated user navigates there directly, they see the "Welcome Back" form.

### Bug 3: signUp object may be null/cleared in Step 2

After `setActive()` is called, the `signUp` object from `useSignUp()` may be cleared by Clerk. Step 2 reads `signUp?.firstName` and `signUp?.lastName` to build `fullName` — this could produce an empty string, storing `fullName: ""` in the database.

## Acceptance Criteria

- [x] Step 2 (profile form) renders after Step 1 completes — user is NOT redirected to dashboard
- [x] User's first/last name from Step 1 is preserved and saved correctly in Step 2
- [x] After Step 2 profile save, user is redirected to `/members/dashboard`
- [x] If user refreshes during Step 2, dashboard's `ProfileCompletionForm` catches incomplete profile
- [x] Sign-in page redirects authenticated users to `/members/dashboard`
- [x] Navigating to `/members` as an authenticated user shows the directory, not the sign-in form
- [x] Clerk fallback redirect URLs point to `/members/dashboard`

## Fix

### 1. `src/app/sign-up/[[...sign-up]]/page.tsx` — Add `completingProfile` flag and store name

Add a `completingProfile` state to suppress the `isSignedIn` redirect during the signup flow. Store `firstName`/`lastName` in parent state so Step 2 doesn't depend on the `signUp` object.

```typescript
function InvitationSignUp({ ticket }: { ticket: string }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [completingProfile, setCompletingProfile] = useState(false);
  const [userName, setUserName] = useState({ firstName: "", lastName: "" });

  // Only redirect if NOT in the middle of profile completion
  useEffect(() => {
    if (isSignedIn && !completingProfile) {
      router.push("/members/dashboard");
    }
  }, [isSignedIn, completingProfile, router]);

  if (!isLoaded) return null;
  if (isSignedIn && !completingProfile) return null;
  // ...
```

Pass `setCompletingProfile` and `setUserName` to `Step1Form`:

```typescript
{step === 1 && (
  <Step1Form
    ticket={ticket}
    isLoaded={isLoaded}
    signUp={signUp}
    setActive={setActive}
    isSubmitting={isSubmitting}
    setIsSubmitting={setIsSubmitting}
    onComplete={(firstName, lastName) => {
      setUserName({ firstName, lastName });
      setStep(2);
    }}
    onBeforeActivate={() => setCompletingProfile(true)}
    onError={setTicketError}
  />
)}

{step === 2 && (
  <Step2Form
    userName={userName}
    isSubmitting={isSubmitting}
    setIsSubmitting={setIsSubmitting}
  />
)}
```

### 2. `src/app/sign-up/[[...sign-up]]/page.tsx` — Step1Form sets flag BEFORE setActive

The `completingProfile` flag must be set **before** `setActive()` is called, so it's in React state before `isSignedIn` changes:

```typescript
if (result.status === "complete" && result.createdSessionId && setActive) {
  onBeforeActivate(); // sets completingProfile = true BEFORE setActive
  await setActive({ session: result.createdSessionId });
  onComplete(data.firstName, data.lastName); // passes name + advances to step 2
}
```

### 3. `src/app/sign-up/[[...sign-up]]/page.tsx` — Step2Form uses `userName` prop, not `signUp`

Replace `signUp` prop with `userName`:

```typescript
function Step2Form({
  userName,
  isSubmitting,
  setIsSubmitting,
}: {
  userName: { firstName: string; lastName: string };
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
}) {
  const router = useRouter();
  // ...
  const onSubmit = async (data: Step2Input) => {
    setIsSubmitting(true);
    try {
      const payload = {
        fullName: `${userName.firstName} ${userName.lastName}`.trim(),
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

### 4. `src/app/sign-in/[[...sign-in]]/page.tsx` — Add isSignedIn guard

Add `useUser()` check to redirect authenticated users:

```typescript
export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useUser();
  const router = useRouter();
  // ...

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(redirectUrl);
    }
  }, [isLoaded, isSignedIn, router, redirectUrl]);

  if (!isLoaded) return null;
  if (isSignedIn) return null;
  // ... rest of form
```

### 5. `.env.local` and `.env.example` — Fix fallback redirect URLs

```
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/members/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/members/dashboard
```

## Context

```
Step 1: signUp.create() → result.status === "complete"
         |
   setCompletingProfile(true)  ← BEFORE setActive
         |
   await setActive({ session })  ← isSignedIn becomes true
         |
   onComplete(firstName, lastName) → setStep(2)
         |
   useEffect fires but completingProfile === true → no redirect
   if (isSignedIn && !completingProfile) → false → Step 2 renders
         |
Step 2: PUT /api/profiles/me with userName from state
         |
   router.push("/members/dashboard")
```

## Edge Cases

**Page refresh during Step 2:** `completingProfile` resets to `false`, user redirected to dashboard. Dashboard's `ProfileCompletionForm` catches incomplete profiles (familyConnection === "" && location === ""). This is the accepted recovery path.

**Sign-in page flash:** Between `isLoaded: false` and `isLoaded: true`, the page renders `null` (no flash). Consistent with how `InvitationSignUp` handles it.

## References

- `src/app/sign-up/[[...sign-up]]/page.tsx:203-288` — InvitationSignUp component (primary fix)
- `src/app/sign-in/[[...sign-in]]/page.tsx:24-157` — Sign-in page (add guard)
- `src/app/(protected)/layout.tsx` — Server-side auth guard (no change needed)
- `src/proxy.ts` — Middleware (no change needed)
- `docs/solutions/integration-issues/clerk-auth-race-condition-setactive-session-propagation.md` — Previous fix docs
- `docs/plans/2026-02-17-fix-signup-step2-status-check-plan.md` — Previous plan
