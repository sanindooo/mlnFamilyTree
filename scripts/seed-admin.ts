/**
 * Bootstrap the first admin user.
 *
 * This script:
 * 1. Creates a Clerk invitation with admin role
 * 2. Pre-creates the waitlist entry as "approved"
 *
 * After running, the admin receives an email invitation to sign up.
 * The webhook will create their user_profiles row automatically.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts <email> <full-name> [family-connection]
 *
 * Example:
 *   npx tsx scripts/seed-admin.ts admin@example.com "Stephen Anindo" "Founder"
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClerkClient } from "@clerk/backend";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { waitlistEntries } from "../src/lib/db/schema.js";

const email = process.argv[2];
const fullName = process.argv[3];
const familyConnection = process.argv[4] || "";

if (!email || !fullName) {
  console.error("Usage: npx tsx scripts/seed-admin.ts <email> <full-name> [family-connection]");
  console.error('Example: npx tsx scripts/seed-admin.ts admin@example.com "Stephen Anindo" "Founder"');
  process.exit(1);
}

const requiredEnvVars = ["DATABASE_URL", "CLERK_SECRET_KEY", "NEXT_PUBLIC_APP_URL"];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function main() {
  console.log(`\nBootstrapping admin user: ${fullName} <${email}>\n`);

  // 1. Create waitlist entry as pre-approved
  console.log("1. Creating approved waitlist entry...");
  const [entry] = await db
    .insert(waitlistEntries)
    .values({
      email,
      fullName,
      familyConnection,
      status: "approved",
    })
    .onConflictDoUpdate({
      target: waitlistEntries.email,
      set: { status: "approved" },
    })
    .returning();
  console.log(`   Waitlist entry #${entry.id} created (status: approved)`);

  // 2. Send Clerk invitation with admin role
  console.log("2. Sending Clerk invitation with admin role...");
  try {
    const invitation = await clerk.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
      publicMetadata: {
        role: "admin",
        waitlistEntryId: entry.id,
        familyConnection,
      },
    });
    console.log(`   Invitation sent (id: ${invitation.id})`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // If user already exists in Clerk, just set them as admin
    if (message.includes("already exists")) {
      console.log("   User already exists in Clerk. Setting admin role...");
      const users = await clerk.users.getUserList({ emailAddress: [email] });
      if (users.data.length > 0) {
        await clerk.users.updateUserMetadata(users.data[0].id, {
          publicMetadata: { role: "admin", familyConnection },
        });
        console.log(`   Admin role set for existing user (id: ${users.data[0].id})`);
      }
    } else {
      throw err;
    }
  }

  console.log("\nDone! The admin user should check their email for the invitation link.");
  console.log("After signing up, they will have full admin access.\n");
}

main().catch((err) => {
  console.error("Failed to bootstrap admin:", err);
  process.exit(1);
});
