# Future Tasks & Potential Requirements

## Sanity CMS

### Separate Development/Production Datasets
**Status:** Potential requirement (not needed yet)

Set up separate Sanity datasets for development and production environments to allow safe testing of content changes before deploying to production.

**Implementation:**
1. Create a "development" dataset in Sanity dashboard
2. Update `.env.local` to use `development` dataset for local development
3. Keep Vercel environment variables pointing to `production` dataset
4. This allows:
   - Local Studio edits → `development` dataset (safe testing)
   - Production site → `production` dataset (live content)
   - Manual migration from `development` → `production` when ready

**Benefits:**
- Test content changes without affecting live site
- Preview edits before going live
- Safer content management workflow

