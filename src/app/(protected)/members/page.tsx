import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const members = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.isVisibleInDirectory, true))
    .orderBy(userProfiles.fullName);

  return (
    <section className="container py-16">
      <div>
        <h1>Members Directory</h1>
        <p className="mt-2 text-muted">
          Browse the MLN family community members
        </p>
      </div>

      {members.length === 0 ? (
        <div className="mt-12 rounded-xl border border-warm-sand bg-white p-12 text-center shadow-sm">
          <p className="text-muted">No members in the directory yet.</p>
          <p className="mt-2 text-sm text-muted">
            Members will appear here once they complete their profiles.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/members/dashboard"
          className="text-sm text-burgundy hover:text-burgundy/80"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </section>
  );
}

function MemberCard({
  member,
}: {
  member: typeof userProfiles.$inferSelect;
}) {
  const initials = member.fullName
    ? member.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Link
      href={`/members/${member.id}`}
      className="block rounded-xl border border-warm-sand bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {member.profilePhotoUrl ? (
          <Image
            src={member.profilePhotoUrl}
            alt={member.fullName}
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-antique-gold object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full border-2 border-antique-gold bg-warm-sand/30 text-sm font-medium text-deep-umber">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="!text-base font-medium text-deep-umber truncate">
            {member.fullName}
          </h3>
          {member.familyConnection && (
            <p className="!text-sm text-antique-gold truncate">
              {member.familyConnection}
            </p>
          )}
        </div>
      </div>

      {member.location && (
        <p className="mt-3 !text-sm text-muted">{member.location}</p>
      )}

      {member.aboutMe && (
        <p className="mt-2 !text-sm text-deep-umber/70 line-clamp-2">
          {member.aboutMe}
        </p>
      )}

      {member.profession && (
        <p className="mt-2 !text-xs text-muted">{member.profession}</p>
      )}
    </Link>
  );
}
