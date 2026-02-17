import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const isVisible = Boolean(body.isVisibleInDirectory);

  const [updated] = await db
    .update(userProfiles)
    .set({ isVisibleInDirectory: isVisible })
    .where(eq(userProfiles.clerkUserId, userId))
    .returning();

  if (!updated) return new Response("Not found", { status: 404 });

  return NextResponse.json({ isVisibleInDirectory: updated.isVisibleInDirectory });
}
