import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { waitlistEntries } from "@/lib/db/schema";
import { waitlistJoinSchema } from "@/lib/validations/waitlist";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = waitlistJoinSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const [entry] = await db
      .insert(waitlistEntries)
      .values(parsed.data)
      .returning();

    return NextResponse.json(
      { message: "You've been added to the waitlist!", entry },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle unique constraint violation (duplicate email)
    if (
      error instanceof Error &&
      error.message.includes("unique")
    ) {
      return NextResponse.json(
        { message: "You're already on the waitlist. We'll be in touch!" },
        { status: 409 }
      );
    }
    console.error("Waitlist error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
