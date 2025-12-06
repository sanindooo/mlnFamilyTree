# Sanity CMS Setup Instructions

All the Sanity integration code has been created! Now you need to initialize your Sanity project and configure it.

## Step 1: Create Your Sanity Project

Run this command in the project root:

```bash
npx sanity@latest init --project-plan free
```

**During the interactive setup:**
1. **Login**: It will open a browser for you to authenticate (Google, GitHub, or email)
2. **Create a new project**: Choose "Yes"
3. **Project name**: Enter "MLN Museum" (or whatever you prefer)
4. **Use default dataset configuration**: Choose "Yes"
5. **Project output path**: Press Enter to skip (we already have the files set up)
6. **Schema**: Choose "Clean project with no predefined schema" (we already have schemas)

**After completion**, the CLI will show you:
- Your **Project ID** (looks like: `abc12345`)
- Your **Dataset name** (usually `production`)

## Step 2: Configure Environment Variables

Create a `.env.local` file in the project root (I've created `.env.local.example` for reference):

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and replace the placeholder values with your actual Sanity project details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

## Step 3: Start the Development Server

```bash
npm run dev
```

Then visit:
- **Main site**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio

## Step 4: Test the Studio

1. Navigate to http://localhost:3000/studio
2. Log in with the same credentials you used in Step 1
3. You should see three document types:
   - **Person** - For family members
   - **Biography** - For detailed life stories
   - **Gallery Image** - For the photo gallery

Try creating a test Person document to verify everything works!

## Step 5: Configure CORS (Important!)

To allow your local dev server and Vercel deployment to access Sanity:

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to **Settings** → **API** → **CORS Origins**
4. Add these origins:
   - `http://localhost:3000` (for local development)
   - `https://your-vercel-domain.vercel.app` (for production)
   - Check "Allow credentials"

## Step 6: Vercel Deployment

When deploying to Vercel:

1. Add the environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to **Environment Variables**
   - Add all three variables from your `.env.local`:
     - `NEXT_PUBLIC_SANITY_PROJECT_ID`
     - `NEXT_PUBLIC_SANITY_DATASET`
     - `NEXT_PUBLIC_SANITY_API_VERSION`

2. Redeploy your app

## Next Steps

### Creating Your First Content

Start by creating the root family member (Martin Luther Nsibirwa):

1. In Sanity Studio, click **Person** → **+** (Create new)
2. Fill in:
   - **Name**: "Katikkiro Martin Luther Nsibirwa MBE"
   - **Slug**: Click "Generate" (should create `katikkiro-martin-luther-nsibirwa-mbe`)
   - **Birth Date**: "1883"
   - **Photo**: Upload the portrait
3. **Publish**

Then create a biography:

1. Click **Biography** → **+**
2. Fill in:
   - **Title**: "Katikkiro Martin Luther Nsibirwa MBE"
   - **Slug**: "martin-luther-nsibirwa"
   - **Person**: Select the person you just created
   - **Content**: Start writing using the rich text editor
3. **Publish**

### Migration From Existing Data

Later, you can create a migration script to import your existing JSON/Markdown data. For now, manual entry is fine for learning the platform!

## File Structure Created

```
/Users/sanindo/MLN/
├── .env.local.example              ← Example env file
├── sanity.config.ts                ← Studio configuration
├── sanity.cli.ts                   ← CLI configuration
├── next.config.ts                  ← Updated with Sanity image domains
├── src/
│   ├── app/
│   │   └── studio/
│   │       └── [[...index]]/
│   │           └── page.tsx        ← Studio route
│   ├── sanity/
│   │   ├── schemas/
│   │   │   ├── person.ts           ← Person schema
│   │   │   ├── biography.ts        ← Biography schema
│   │   │   ├── galleryImage.ts     ← Gallery image schema
│   │   │   └── index.ts            ← Schema exports
│   │   ├── lib/
│   │   │   ├── queries.ts          ← GROQ queries
│   │   │   ├── adapters.ts         ← Data adapters
│   │   │   ├── fetch.ts            ← Fetch utilities
│   │   │   └── client.ts           ← Sanity client
│   │   ├── components/
│   │   │   └── PortableTextRenderer.tsx  ← Rich text renderer
│   │   └── env.ts                  ← Environment helpers
│   ├── components/
│   │   └── biography/
│   │       └── BiographyContent.tsx  ← Updated to support PortableText
│   └── types/
│       └── index.ts                ← Updated with Sanity types
```

## Troubleshooting

### "Missing environment variable" error
- Make sure you've created `.env.local` with your actual project ID
- Restart the dev server after adding env variables

### Studio shows "Invalid credentials"
- Make sure CORS is configured in Sanity project settings
- Try clearing browser cache and logging in again

### Images not showing
- Check that `next.config.ts` includes the Sanity CDN domain
- Verify images are properly uploaded in Sanity Studio

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/next-js-quickstart)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Portable Text](https://www.sanity.io/docs/presenting-block-text)

