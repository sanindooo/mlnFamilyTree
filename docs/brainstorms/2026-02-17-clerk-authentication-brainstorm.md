# Clerk Authentication Integration

**Date:** 2026-02-17
**Status:** Brainstorm
**Author:** Sanindo + Claude

---

## What We're Building

Adding Clerk authentication to the MLN family website to gate a new `/members` section behind login. This section will house personal, identifiable information that only authenticated and admin-approved users can access.

**The vision:** A "family social media" where members can create profiles with personal info and interests, browse other members' profiles (filterable directory), and eventually participate in forum-like discussions.

**For this phase:** We're setting up the Clerk auth foundation and creating a placeholder members area with a mock profile card layout — just enough to prove the auth flow works and hint at the future member experience.

---

## Why This Approach

**Clerk + Route Group pattern** was chosen because:

1. **Admin approval registration** — Clerk natively supports waitlist/approval modes, which fits the controlled family community model
2. **Route groups** — A `(protected)` route group in the App Router makes it structurally clear which pages are gated, and scales easily as more member features are added
3. **Embedded sign-in/sign-up** — Components live at `/sign-in` and `/sign-up` routes, styled to match the site's aesthetic (cream, burgundy, antique-gold)
4. **No changes to public pages** — Gallery, family tree, member bios, and stories remain fully public

---

## Key Decisions

1. **Registration model:** Admin approval required. Users can request an account but must be approved before gaining access.

2. **Protected route structure:** Use a `(protected)` route group under `src/app/` to house `/members` and any future gated pages. Middleware enforces auth for this group.

3. **Sign-in UX:** Embedded Clerk components at `/sign-in` and `/sign-up`, styled to match the site theme. Not Clerk-hosted redirect pages.

4. **Navigation integration:** Sign-in button and `<UserButton>` added directly to the existing Navbar component. Shows sign-in for unauthenticated users, avatar/menu for authenticated users.

5. **Placeholder content:** A mock profile card layout at `/members` showing where personal info, interests, and bio would go — with dummy data. Not a full directory yet.

6. **Middleware placement:** `src/middleware.ts` (inside the `src/` directory since the project uses `src/`). Uses `clerkMiddleware()` from `@clerk/nextjs/server`.

7. **Forum feature:** Deferred. Not part of this phase. The route group approach supports adding it later without structural changes.

---

## Scope

### In Scope
- Install `@clerk/nextjs`
- Configure `.env.local` with Clerk keys (placeholders in code)
- Create `.env.example` documenting required variables
- Create `src/middleware.ts` with `clerkMiddleware()`
- Wrap app with `<ClerkProvider>` in root layout
- Add auth controls to Navbar (`<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<UserButton>`)
- Create `/sign-in` and `/sign-up` routes with embedded Clerk components
- Create `(protected)` route group
- Create `/members` page with mock profile card placeholder
- Configure Clerk dashboard for admin approval mode (manual step)

### Out of Scope
- User profile CRUD (real data, not mocks)
- Member directory with filtering
- Forum/stories feature
- Clerk theming beyond basic alignment with site colors
- Database setup for user-generated content
- API routes for member data

---

## Technical Notes

- **Next.js 16** with **React 19** — verify `@clerk/nextjs@latest` supports these versions
- **Tailwind v4** — Clerk component styling should use the existing custom theme tokens (`cream`, `burgundy`, `deep-umber`, `antique-gold`)
- **Sanity Studio** at `/studio` — exclude from Clerk middleware (Sanity has its own auth)
- **No existing middleware** — clean slate for `src/middleware.ts`

---

## Open Questions

_None — all questions resolved during brainstorm._
