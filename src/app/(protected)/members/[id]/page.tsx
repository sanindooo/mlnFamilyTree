import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memberId = parseInt(id, 10);

  if (isNaN(memberId)) notFound();

  const [member] = await db
    .select()
    .from(userProfiles)
    .where(
      and(
        eq(userProfiles.id, memberId),
        eq(userProfiles.isVisibleInDirectory, true)
      )
    );

  if (!member) notFound();

  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section className="container py-16">
      <Link
        href="/members"
        className="text-sm text-burgundy hover:text-burgundy/80"
      >
        &larr; Back to Directory
      </Link>

      <div className="mt-8 mx-auto max-w-2xl rounded-xl border border-warm-sand bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-6">
          {member.profilePhotoUrl ? (
            <Image
              src={member.profilePhotoUrl}
              alt={member.fullName}
              width={96}
              height={96}
              className="size-24 rounded-full border-2 border-antique-gold object-cover"
            />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full border-2 border-antique-gold bg-warm-sand/30 text-2xl font-medium text-deep-umber">
              {initials}
            </div>
          )}
          <div>
            <h1 className="!text-2xl md:!text-3xl">{member.fullName}</h1>
            {member.familyConnection && (
              <p className="mt-1 text-antique-gold">
                {member.familyConnection}
              </p>
            )}
            {member.location && (
              <p className="mt-1 !text-sm text-muted">{member.location}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-8 space-y-6">
          {member.aboutMe && (
            <div>
              <h4 className="!text-sm font-medium text-muted uppercase tracking-wider">
                About
              </h4>
              <p className="mt-2 !text-base text-deep-umber whitespace-pre-line">
                {member.aboutMe}
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {member.profession && (
              <div>
                <h4 className="!text-sm font-medium text-muted uppercase tracking-wider">
                  Profession
                </h4>
                <p className="mt-1 !text-base text-deep-umber">
                  {member.profession}
                </p>
              </div>
            )}
            {member.company && (
              <div>
                <h4 className="!text-sm font-medium text-muted uppercase tracking-wider">
                  Company
                </h4>
                <p className="mt-1 !text-base text-deep-umber">
                  {member.company}
                </p>
              </div>
            )}
            {member.interests && (
              <div className="sm:col-span-2">
                <h4 className="!text-sm font-medium text-muted uppercase tracking-wider">
                  Interests
                </h4>
                <p className="mt-1 !text-base text-deep-umber">
                  {member.interests}
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          {(member.linkedinUrl ||
            member.twitterUrl ||
            member.websiteUrl) && (
            <div>
              <h4 className="!text-sm font-medium text-muted uppercase tracking-wider">
                Links
              </h4>
              <div className="mt-2 flex flex-wrap gap-4">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-burgundy hover:text-burgundy/80"
                  >
                    LinkedIn
                  </a>
                )}
                {member.twitterUrl && (
                  <a
                    href={member.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-burgundy hover:text-burgundy/80"
                  >
                    Twitter/X
                  </a>
                )}
                {member.websiteUrl && (
                  <a
                    href={member.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-burgundy hover:text-burgundy/80"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
