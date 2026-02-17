import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { generateSlug } from "@/lib/utils/slug";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const { id, first_name, last_name } = evt.data;
      const fullName =
        [first_name, last_name].filter(Boolean).join(" ") || "Member";

      await db
        .insert(userProfiles)
        .values({
          clerkUserId: id,
          slug: generateSlug(fullName),
          fullName,
          familyConnection: "",
          location: "",
        })
        .onConflictDoUpdate({
          target: userProfiles.clerkUserId,
          set: { fullName },
        });
    }

    if (evt.type === "user.updated") {
      const { id, first_name, last_name } = evt.data;
      const fullName = [first_name, last_name].filter(Boolean).join(" ");

      if (fullName) {
        await db
          .update(userProfiles)
          .set({ fullName })
          .where(eq(userProfiles.clerkUserId, id));
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }
}
