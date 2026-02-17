import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { waitlistEntries } from "@/lib/db/schema";

const waitlistActionSchema = z.object({
  entryId: z.number().int().positive(),
  action: z.enum(["approve", "deny"]),
  makeAdmin: z.boolean().optional(),
});

async function isAdmin(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata as { role?: string }).role === "admin";
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  if (!(await isAdmin(userId))) {
    return new Response("Forbidden", { status: 403 });
  }

  const entries = await db
    .select()
    .from(waitlistEntries)
    .orderBy(waitlistEntries.createdAt);

  return NextResponse.json(entries);
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  if (!(await isAdmin(userId))) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await req.json();
  const parsed = waitlistActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { entryId, action, makeAdmin } = parsed.data;

  // Get the waitlist entry
  const [entry] = await db
    .select()
    .from(waitlistEntries)
    .where(eq(waitlistEntries.id, entryId));

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  if (action === "approve") {
    // Send Clerk invitation
    const client = await clerkClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Server misconfiguration: NEXT_PUBLIC_APP_URL is not set" },
        { status: 500 }
      );
    }
    try {
      await client.invitations.createInvitation({
        emailAddress: entry.email,
        redirectUrl: `${baseUrl}/sign-up`,
        publicMetadata: {
          waitlistEntryId: entry.id,
          familyConnection: entry.familyConnection,
          ...(makeAdmin ? { role: "admin" } : {}),
        },
      });
    } catch (error) {
      console.error("Failed to create invitation:", error);
      return NextResponse.json(
        { error: "Failed to send invitation email" },
        { status: 500 }
      );
    }
  }

  // Update entry status
  const [updated] = await db
    .update(waitlistEntries)
    .set({ status: action === "approve" ? "approved" : "denied" })
    .where(eq(waitlistEntries.id, entryId))
    .returning();

  return NextResponse.json(updated);
}
