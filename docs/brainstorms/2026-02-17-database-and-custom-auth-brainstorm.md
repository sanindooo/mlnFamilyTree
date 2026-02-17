# Database Integration & Custom Auth Components

**Date:** 2026-02-17
**Status:** Brainstorm complete

## What We're Building

Connect Clerk authentication to a database so that members can have rich profiles beyond what Clerk stores natively. Replace Clerk's pre-built UI components with fully custom forms using Clerk's JavaScript SDK to create a professional, trust-building auth experience that matches the MLN Museum brand.

### Core Deliverables

1. **Database layer** — Vercel Postgres + Drizzle ORM for extended user profiles
2. **Custom waitlist form** — Own waitlist join form storing emails in DB, with Clerk invitation API for approvals
3. **Custom sign-up form** — Multi-step: Clerk SDK for auth (email/password/name), then custom form for extended profile data
4. **Custom sign-in form** — Built with Clerk SDK hooks, matching site design
5. **Custom navbar user menu** — Replace `<UserButton>` with a branded avatar dropdown
6. **User dashboard** — Full profile editing, password change, email management, account deletion
7. **Members directory** — Listing of approved members with opt-in visibility (opted in by default)
8. **Profile photo uploads** — Via Vercel Blob Storage

## Why This Approach

**Clerk SDK (custom forms) + Vercel Postgres + Drizzle ORM**

- **Clerk SDK (not Clerk Elements)**: Clerk Elements is frozen and no longer receiving updates. Instead, we use Clerk's JavaScript SDK hooks (`useSignIn`, `useSignUp`, `useUser`) directly to build fully custom forms. Clerk still handles all auth security (password hashing, session management, email verification, rate limiting) — we just own the UI completely.
- **Custom waitlist over Clerk's `<Waitlist>` component**: Building our own waitlist form gives full design control and stores waitlist entries in our database. We use Clerk's invitation API (`clerkClient().invitations.createInvitation()`) to approve users, which sends them an invite email to complete sign-up.
- **Vercel Postgres (Neon)**: First-party Vercel integration — one-click setup from the Vercel dashboard, automatic connection string injection via environment variables, generous free tier.
- **Drizzle ORM**: TypeScript-native schema definitions (no raw SQL needed), lightweight, excellent Next.js compatibility, built-in migration tooling.
- **Vercel Blob Storage**: First-party Vercel integration for profile photo uploads. Simple API, automatic CDN, keeps everything in the Vercel ecosystem.

This combination is fully future-proof (no dependency on frozen libraries), gives complete design control, and keeps the entire stack within the Vercel ecosystem.

## Key Decisions

### Database & Schema

- **Database**: Vercel Postgres (powered by Neon)
- **ORM**: Drizzle ORM (TypeScript schema definitions)
- **Profile photo storage**: Vercel Blob Storage

#### Tables

**`user_profiles`** — linked to Clerk user ID

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | serial | PK | Auto-increment |
| `clerk_user_id` | text | unique, not null | Primary link to Clerk |
| `full_name` | text | not null | |
| `family_connection` | text | not null | How they relate to the Nsibirwa family |
| `location` | text | not null | |
| `about_me` | text | | |
| `interests` | text | | |
| `profession` | text | | |
| `company` | text | | |
| `phone` | text | | |
| `linkedin_url` | text | | |
| `twitter_url` | text | | |
| `website_url` | text | | |
| `profile_photo_url` | text | | URL from Vercel Blob |
| `is_visible_in_directory` | boolean | default: true | Opt-in, defaulted to visible |
| `created_at` | timestamp | default: now() | |
| `updated_at` | timestamp | default: now() | |

**`waitlist_entries`** — custom waitlist

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | serial | PK | |
| `email` | text | unique, not null | |
| `full_name` | text | not null | |
| `family_connection` | text | not null | Reason/relation for requesting access |
| `status` | text | default: 'pending' | pending / approved / denied |
| `created_at` | timestamp | default: now() | |
| `updated_at` | timestamp | default: now() | |

### Waitlist Flow

1. User visits `/sign-up` → sees a custom waitlist join form (name, email, family connection)
2. Form submits to an API route → stores entry in `waitlist_entries` table
3. Admin reviews waitlist entries (either via a simple admin UI in the dashboard or directly in the database)
4. Admin approves → API route calls `clerkClient().invitations.createInvitation({ emailAddress })` → user receives invite email
5. User clicks invite link → lands on sign-up page with invitation token
6. User completes sign-up (password + extended profile fields) → profile saved to `user_profiles`

### Sign-Up Flow (After Approval)

- **Multi-step custom form using Clerk SDK**:
  - Step 1: Email (pre-filled from invitation), password, full name — uses `useSignUp()` hook
  - Step 2: Family connection, location (required) + optional profile fields — saved to DB via API route
- **Required fields at sign-up**: Name, family connection, location
- **Optional fields**: Everything else, fillable later from dashboard

### Sign-In Flow

- Custom form using `useSignIn()` hook from Clerk SDK
- Fields: email + password
- Matches MLN Museum design — dark theme, gold accents, professional feel
- Redirects to `/members` dashboard on success

### Navbar User Menu

- Replace Clerk `<UserButton>` with custom avatar dropdown
- Uses `useUser()` hook to get avatar and name
- Dropdown includes: Dashboard link, Sign Out action (via `useClerk().signOut()`)
- For signed-out users: "Sign In" button (custom styled)

### User Dashboard (`/members`)

- **Profile section**: Edit all profile fields, upload profile photo (via Vercel Blob)
- **Account section**: Change password, update email, delete account (via Clerk's `useUser().update()` and related APIs)
- **Directory visibility toggle**: Opt in/out of the members directory
- Standard account management — no activity tracking or notifications for now

### Members Directory

- Shows all members where `is_visible_in_directory = true`
- Displays: name, family connection, location, photo, about me (truncated)
- Click through to a full member profile view
- Only visible to authenticated members (behind `/members` protection)

### User Sync Strategy

- **Clerk webhook + client fallback**: Set up a Clerk webhook (`user.created`, `user.updated`) at `/api/webhooks/clerk` to automatically create/update DB records. Client-side check as fallback to handle edge cases.
- When a user completes sign-up, the webhook fires and creates a `user_profiles` record. The sign-up form's Step 2 then updates this record with extended profile data.

### Design Approach

- Professional, industry-standard form patterns that build trust
- Match site theme (dark backgrounds, gold accents, museum typography)
- Balance between brand consistency and familiar auth UX conventions
- Forms should feel like a premium experience, not a generic template

## Resolved Questions

1. **Profile photo storage**: Vercel Blob Storage — keeps everything in the Vercel ecosystem, simple API, automatic CDN.

2. **Waitlist + custom UI**: Clerk Elements is frozen and doesn't support waitlist. Solution: build a fully custom waitlist form that stores entries in our DB, use Clerk's invitation API to approve users.

3. **User sync**: Webhook + client fallback approach. Clerk webhook auto-creates DB records, with client-side check as fallback for robustness.
