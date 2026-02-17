---
title: "feat: Add Clerk Authentication with Protected Members Area"
type: feat
status: active
date: 2026-02-17
brainstorm: docs/brainstorms/2026-02-17-clerk-authentication-brainstorm.md
---

# feat: Add Clerk Authentication with Protected Members Area

## Overview

Integrate Clerk authentication into the MLN Museum Next.js 16 site. This adds a gated `/members` section behind admin-approved registration, embedded sign-in/sign-up pages styled to match the site theme, and auth controls in the existing Navbar. All current public pages remain unaffected.

## Problem Statement / Motivation

The MLN family website needs a private members area where family members can share personal information, interests, and eventually participate in discussions. Personally identifiable information must be protected behind authentication, and registration must be admin-controlled to keep the community limited to verified family members.

## Proposed Solution

- Install `@clerk/nextjs` and configure Clerk with **Waitlist mode** (admin approval)
- Use Next.js 16's `proxy.ts` with `clerkMiddleware()` and `createRouteMatcher()` to selectively protect `/members` routes
- Wrap the app with `<ClerkProvider>` in the root layout with Tailwind v4 CSS layer compatibility
- Add `<SignedIn>` / `<SignedOut>` auth controls to the Navbar (desktop + mobile)
- Create embedded `/sign-in` and `/sign-up` pages using catch-all routes
- Create a `(protected)` route group containing the `/members` page with a mock profile card

## Technical Considerations

### Next.js 16 `proxy.ts` Convention

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The Clerk SDK's `clerkMiddleware()` returns a middleware function. Verify during implementation that `export default clerkMiddleware()` works in `proxy.ts`, or if a named export is needed:

```typescript
// If default export works (likely):
export default clerkMiddleware(...)

// If named export is needed:
const handler = clerkMiddleware(...)
export { handler as proxy }
```

### Tailwind v4 CSS Layer Conflict

Clerk components inject their own styles which can conflict with Tailwind v4's layer ordering. The fix is setting `cssLayerName: 'clerk'` on `<ClerkProvider>` and declaring the layer order in `globals.css`:

```css
@layer clerk, base, components, utilities;
```

### Sanity Studio Isolation

The `/studio` route has its own auth (Sanity's built-in). Exclude it from the `proxy.ts` matcher pattern entirely so Clerk never processes those requests.

### `/member/[slug]` vs `/members` Naming

Existing public route `/member/[slug]` (singular) for biographies is similar to new protected `/members` (plural). This is an accepted naming distinction — no redirect needed now, but worth noting for future UX considerations.

## Acceptance Criteria

- [x] `@clerk/nextjs` installed and configured
- [x] `proxy.ts` created with `clerkMiddleware()` protecting `/members(.*)` routes
- [x] `/studio` routes excluded from Clerk middleware
- [x] `<ClerkProvider>` wrapping app in root layout with `cssLayerName: 'clerk'`
- [x] Navbar shows `<SignInButton>` when signed out, `<UserButton>` + "Members" link when signed in
- [x] Mobile drawer includes auth controls at the bottom
- [x] `/sign-in` page with embedded `<SignIn />` component (catch-all route)
- [x] `/sign-up` page with embedded `<Waitlist />` component (admin approval mode)
- [x] `(protected)` route group with `/members` page
- [x] `/members` page shows mock profile card using Clerk `useUser()` data
- [x] Unauthenticated users accessing `/members` are redirected to `/sign-in`
- [x] After sign-in, users are redirected back to the page they were trying to access
- [x] `.env.example` created documenting required Clerk environment variables
- [x] All existing public pages remain fully accessible without auth

## Implementation Phases

### Phase 1: Install and Configure Clerk Foundation

**Files to create/modify:**

#### `package.json` — Install dependency

```bash
npm install @clerk/nextjs@latest
```

#### `.env.local` — Add Clerk keys (manual step)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/members
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/members
```

#### `.env.example` — New file

```
# Clerk Authentication
# Get these from https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk routing
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/members
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/members
```

#### `src/proxy.ts` — New file (Next.js 16 middleware)

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/members(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (isProtectedRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals, static files, and Sanity Studio
		"/((?!_next|studio|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
```

> **Note:** Uses selective protection — only `/members(.*)` requires auth. All other routes pass through freely. `/studio` is excluded from the matcher entirely.

#### `src/app/globals.css` — Add CSS layer declaration

Add this line at the very top of the file, before `@import "tailwindcss"`:

```css
@layer clerk, base, components, utilities;
```

#### `src/app/layout.tsx` — Wrap with ClerkProvider

```typescript
import { ClerkProvider } from "@clerk/nextjs";
// ... existing imports

export default function RootLayout({ children }) {
	return (
		<ClerkProvider appearance={{ cssLayerName: "clerk" }}>
			<html lang="en" className={`${playfairDisplay.variable} ${lato.variable}`}>
				<body className="font-sans antialiased bg-cream text-deep-umber">
					<SmoothScroll>
						<Navbar />
						<main>{children}</main>
						<Footer />
					</SmoothScroll>
					<Toaster position="bottom-center" richColors />
				</body>
			</html>
		</ClerkProvider>
	);
}
```

### Phase 2: Auth Pages (Sign-In + Waitlist)

#### `src/app/sign-in/[[...sign-in]]/page.tsx` — New file

Embedded `<SignIn />` component with catch-all route for multi-step flows (email verification, OAuth callbacks).

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center py-16">
			<SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
		</div>
	);
}
```

#### `src/app/sign-up/[[...sign-up]]/page.tsx` — New file

Since Waitlist mode is enabled, render the `<Waitlist />` component instead of `<SignUp />`. Users with invitation links will still be able to complete sign-up through Clerk's flow.

```tsx
import { Waitlist } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center py-16">
			<Waitlist signInUrl="/sign-in" />
		</div>
	);
}
```

> **Manual step:** Enable Waitlist mode in Clerk Dashboard → Settings → Restrictions → Sign-up mode → Waitlist.

### Phase 3: Navbar Auth Controls

#### `src/components/layout/Navbar.tsx` — Modify existing file

**Desktop (right side, lines 180-189):** Replace the Biography CTA button with auth controls. The Biography link already exists in the desktop dropdown and mobile drawer.

```tsx
// Add imports at top:
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/nextjs";

// Replace right-side CTA (lines 180-189) with:
<div className="flex items-center gap-3">
	<SignedIn>
		<Link
			href="/members"
			className="text-base font-medium text-deep-umber hover:text-burgundy transition-colors"
		>
			Members
		</Link>
		<UserButton afterSignOutUrl="/" />
	</SignedIn>
	<SignedOut>
		<SignInButton mode="redirect">
			<button className="text-base font-medium text-deep-umber hover:text-burgundy transition-colors cursor-pointer">
				Sign In
			</button>
		</SignInButton>
	</SignedOut>
</div>
```

**Mobile drawer (after line 270, end of `<ul>`):** Add auth controls at the bottom of the navigation list.

```tsx
{/* Auth controls at bottom of mobile nav */}
<li className="mt-4 pt-4 border-t border-warm-sand">
	<SignedIn>
		<Link
			href="/members"
			className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
			onClick={toggleMobileMenu}
		>
			Members
		</Link>
		<div className="py-3 px-2">
			<UserButton afterSignOutUrl="/" />
		</div>
	</SignedIn>
	<SignedOut>
		<SignInButton mode="redirect">
			<button
				className="block w-full text-left text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors cursor-pointer"
				onClick={toggleMobileMenu}
			>
				Sign In
			</button>
		</SignInButton>
	</SignedOut>
</li>
```

### Phase 4: Protected Route Group + Members Page

#### `src/app/(protected)/layout.tsx` — New file

Server-side auth check as defense-in-depth (in addition to middleware):

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	return <>{children}</>;
}
```

#### `src/app/(protected)/members/page.tsx` — New file

Mock profile card placeholder using Clerk's `useUser()` hook to display the authenticated user's info:

```tsx
"use client";

import { useUser } from "@clerk/nextjs";

export default function MembersPage() {
	const { user } = useUser();

	return (
		<section className="container py-16">
			<h1>Members Area</h1>
			<p className="mt-4 text-muted">
				Welcome to the MLN family members area. This is a preview of what the member experience will look like.
			</p>

			{/* Mock Profile Card */}
			<div className="mt-12 max-w-md rounded-xl border border-warm-sand bg-white p-8 shadow-sm">
				<div className="flex items-center gap-4">
					{user?.imageUrl && (
						<img
							src={user.imageUrl}
							alt={user.fullName || "Profile"}
							className="size-16 rounded-full border-2 border-antique-gold object-cover"
						/>
					)}
					<div>
						<h3 className="text-lg">{user?.fullName || "Family Member"}</h3>
						<p className="text-sm text-muted">
							{user?.primaryEmailAddress?.emailAddress}
						</p>
					</div>
				</div>

				{/* Placeholder fields */}
				<div className="mt-6 space-y-4">
					<div>
						<h6 className="text-xs text-muted">Location</h6>
						<p className="text-sm text-deep-umber/60 italic">Not yet provided</p>
					</div>
					<div>
						<h6 className="text-xs text-muted">Interests</h6>
						<p className="text-sm text-deep-umber/60 italic">Not yet provided</p>
					</div>
					<div>
						<h6 className="text-xs text-muted">About Me</h6>
						<p className="text-sm text-deep-umber/60 italic">Not yet provided</p>
					</div>
				</div>
			</div>
		</section>
	);
}
```

## File Summary

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/proxy.ts` | Clerk middleware (Next.js 16 convention) |
| CREATE | `.env.example` | Document required environment variables |
| CREATE | `src/app/sign-in/[[...sign-in]]/page.tsx` | Embedded sign-in page |
| CREATE | `src/app/sign-up/[[...sign-up]]/page.tsx` | Waitlist / sign-up page |
| CREATE | `src/app/(protected)/layout.tsx` | Auth guard layout for protected routes |
| CREATE | `src/app/(protected)/members/page.tsx` | Mock profile card placeholder |
| MODIFY | `src/app/layout.tsx` | Add `<ClerkProvider>` wrapper |
| MODIFY | `src/app/globals.css` | Add CSS layer declaration for Clerk |
| MODIFY | `src/components/layout/Navbar.tsx` | Add auth controls (desktop + mobile) |
| MODIFY | `.env.local` | Add Clerk API keys (manual) |

## Manual Steps (Clerk Dashboard)

1. Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy API keys to `.env.local`
3. Enable **Waitlist mode**: Settings → Restrictions → Sign-up mode → Waitlist
4. Configure allowed sign-in methods (email, Google, etc.) as desired

## Dependencies & Risks

- **Next.js 16 + `proxy.ts` compatibility:** The Clerk SDK may still expect `middleware.ts`. If `proxy.ts` doesn't work, fall back to `middleware.ts` (Next.js 16 may still support it for backwards compatibility).
- **`@clerk/nextjs` version:** Must be v6.37+ for Next.js 16 and React 19 support. Run `npm install @clerk/nextjs@latest` to ensure the latest.
- **Tailwind v4 style conflicts:** Mitigated by `cssLayerName: 'clerk'` and `@layer` declaration. Test that Clerk component styles render correctly.
- **`<Waitlist />` component availability:** Requires `@clerk/nextjs` v6.2.0+ (November 2024). The latest version includes this.

## Success Metrics

- Unauthenticated users can browse all existing public pages without friction
- Unauthenticated users accessing `/members` are redirected to `/sign-in`
- New users see the Waitlist form at `/sign-up` and can request access
- Admin can approve users in the Clerk Dashboard
- Approved users can sign in and see the mock profile card at `/members`
- Auth controls appear correctly in both desktop and mobile Navbar

## References & Research

### Internal References
- Root layout: `src/app/layout.tsx`
- Navbar component: `src/components/layout/Navbar.tsx` (lines 180-189 for desktop CTA, 194-282 for mobile drawer)
- Theme tokens: `src/app/globals.css` (lines 4-14)
- Button component: `src/components/ui/Button.tsx`

### External References
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [clerkMiddleware() Reference](https://clerk.com/docs/references/nextjs/clerk-middleware)
- [Clerk Waitlist Component](https://clerk.com/docs/nextjs/reference/components/authentication/waitlist)
- [Clerk Appearance Prop](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

### Brainstorm
- [Clerk Authentication Brainstorm](../brainstorms/2026-02-17-clerk-authentication-brainstorm.md)
