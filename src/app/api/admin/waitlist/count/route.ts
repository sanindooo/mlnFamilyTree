import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq, count } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { waitlistEntries } from "@/lib/db/schema";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if ((user.publicMetadata as { role?: string }).role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const [result] = await db
    .select({ count: count() })
    .from(waitlistEntries)
    .where(eq(waitlistEntries.status, "pending"));

  return NextResponse.json({ count: result.count });
}
