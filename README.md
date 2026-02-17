# MLN Museum

A family museum and community website built with Next.js, Sanity CMS, Clerk authentication, Neon Postgres, and Vercel Blob storage.

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database
- A [Clerk](https://clerk.com) application
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store (for avatar uploads)
- A [Sanity](https://sanity.io) project (for CMS content)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Postgres connection string (pooled) |
| `DATABASE_URL_UNPOOLED` | Neon Postgres connection string (direct) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g. `http://localhost:3000` or production URL) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The database is managed with [Drizzle ORM](https://orm.drizzle.team/). The schema is defined in `src/lib/db/schema.ts`.

### After Updating the Schema

Whenever you make changes to `src/lib/db/schema.ts` (adding columns, tables, indexes, etc.), you need to push those changes to your database:

```bash
npx drizzle-kit push
```

This compares your schema file against the live database and applies the differences. Drizzle will show you exactly what SQL it plans to run and ask for confirmation before executing.

### Common Schema Operations

**Add a new column:**

1. Add the column definition in `src/lib/db/schema.ts`
2. Run `npx drizzle-kit push`
3. If the column is `NOT NULL` without a default, Drizzle may ask to truncate the table. For production databases with existing data, add the column as nullable first, backfill, then add the constraint manually.

**Add an index:**

1. Add the index in the table's third argument in `src/lib/db/schema.ts`
2. Run `npx drizzle-kit push` -- indexes are additive and safe to apply

**Inspect the current database:**

```bash
npx drizzle-kit studio
```

This opens a web UI at `https://local.drizzle.studio` where you can browse tables and data.

### Production Migrations

For production deployments, use Drizzle's migration workflow instead of `push`:

```bash
# Generate a migration file from schema changes
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit migrate
```

This creates versioned SQL migration files in the `drizzle/` directory that can be reviewed and committed to git.

## Bootstrapping the First Admin

The app uses a waitlist + admin approval flow, which creates a chicken-and-egg problem: you need an admin to approve users, but there's no admin yet.

A seed script handles this in one command:

```bash
npm run seed:admin admin@example.com "Your Name" "Family connection"
```

This will:
1. Create a pre-approved waitlist entry in the database
2. Send a Clerk invitation email with the admin role attached
3. If the user already exists in Clerk, it sets their role to admin instead

After running, check your email for the invitation link, sign up, and you'll have full admin access.

## Clerk Webhooks

The app uses a Clerk webhook at `/api/webhooks/clerk` to sync user data to the database.

### Local Development

Use [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 3000
```

Then set the webhook URL in Clerk Dashboard to `https://<your-ngrok-url>/api/webhooks/clerk`.

### Production

Set the webhook URL in Clerk Dashboard to `https://<your-domain>/api/webhooks/clerk`.

Subscribe to these events: `user.created`, `user.updated`.

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel
2. Set all environment variables listed above
3. Make sure `NEXT_PUBLIC_APP_URL` points to your production domain
4. Set up the Clerk webhook endpoint with your production URL
5. Deploy
