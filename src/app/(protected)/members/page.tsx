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
      href={`/members/${member.slug}`}
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
            <p className="flex items-center gap-1 !text-sm text-antique-gold truncate">
              <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <span className="truncate">{member.familyConnection}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {member.location && (
          <p className="flex items-center gap-1.5 !text-sm text-muted">
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {member.location}
          </p>
        )}

        {member.profession && (
          <p className="flex items-center gap-1.5 !text-sm text-muted">
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            {member.profession}
          </p>
        )}

        {member.interests && (
          <p className="flex items-center gap-1.5 !text-sm text-muted">
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
            <span className="truncate">{member.interests}</span>
          </p>
        )}
      </div>

      {member.aboutMe && (
        <p className="mt-2 !text-sm text-deep-umber/70 line-clamp-2">
          {member.aboutMe}
        </p>
      )}
    </Link>
  );
}
