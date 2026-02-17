import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Accepted: JPEG, PNG, WebP" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB" },
      { status: 400 }
    );
  }

  // Get current profile to check for existing photo
  const [profile] = await db
    .select({ profilePhotoUrl: userProfiles.profilePhotoUrl })
    .from(userProfiles)
    .where(eq(userProfiles.clerkUserId, userId));

  // Delete old blob if exists
  if (profile?.profilePhotoUrl) {
    try {
      await del(profile.profilePhotoUrl);
    } catch {
      // Old blob may already be deleted, continue
    }
  }

  // Upload new photo
  const blob = await put(`avatars/${userId}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  // Update profile with new photo URL
  await db
    .update(userProfiles)
    .set({ profilePhotoUrl: blob.url })
    .where(eq(userProfiles.clerkUserId, userId));

  return NextResponse.json({ url: blob.url });
}
