import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { profileUpdateSchema } from "@/lib/validations/profile";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.clerkUserId, userId));

  if (!profile) return new Response("Not found", { status: 404 });

  return NextResponse.json(profile);
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Clean empty strings to null for URL fields
  const data = { ...parsed.data };
  for (const key of ["linkedinUrl", "twitterUrl", "websiteUrl"] as const) {
    if (key in data && data[key] === "") {
      (data as Record<string, unknown>)[key] = null;
    }
  }

  const [updated] = await db
    .update(userProfiles)
    .set(data)
    .where(eq(userProfiles.clerkUserId, userId))
    .returning();

  if (!updated) return new Response("Not found", { status: 404 });

  return NextResponse.json(updated);
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Upsert: create if missing, update if exists (client-side fallback)
  const [upserted] = await db
    .insert(userProfiles)
    .values({
      clerkUserId: userId,
      fullName: parsed.data.fullName || "Member",
      familyConnection: parsed.data.familyConnection || "",
      location: parsed.data.location || "",
      ...parsed.data,
    })
    .onConflictDoUpdate({
      target: userProfiles.clerkUserId,
      set: parsed.data,
    })
    .returning();

  return NextResponse.json(upserted);
}
