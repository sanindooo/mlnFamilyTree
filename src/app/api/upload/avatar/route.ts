import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Magic bytes for allowed image types
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
};

function validateMagicBytes(buffer: ArrayBuffer, declaredType: string): boolean {
  const bytes = new Uint8Array(buffer).slice(0, 8);
  const signatures = MAGIC_BYTES[declaredType];
  if (!signatures) return false;
  return signatures.some((sig) =>
    sig.every((byte, i) => bytes[i] === byte)
  );
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
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

  // Validate actual file content matches declared type
  const buffer = await file.arrayBuffer();
  if (!validateMagicBytes(buffer, file.type)) {
    return NextResponse.json(
      { error: "File content does not match declared type" },
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

  // Upload new photo (use buffer since we already read it for validation)
  const blob = await put(`avatars/${userId}-${file.name}`, buffer, {
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
