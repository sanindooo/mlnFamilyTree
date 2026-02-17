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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [member] = await db
    .select()
    .from(userProfiles)
    .where(
      and(
        eq(userProfiles.slug, slug),
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
              <p className="mt-1 flex items-center gap-1.5 !text-sm text-muted">
                <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {member.location}
              </p>
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
                <h4 className="flex items-center gap-1.5 !text-sm font-medium text-muted uppercase tracking-wider">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Profession
                </h4>
                <p className="mt-1 !text-base text-deep-umber">
                  {member.profession}
                </p>
              </div>
            )}
            {member.company && (
              <div>
                <h4 className="flex items-center gap-1.5 !text-sm font-medium text-muted uppercase tracking-wider">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                  Company
                </h4>
                <p className="mt-1 !text-base text-deep-umber">
                  {member.company}
                </p>
              </div>
            )}
            {member.interests && (
              <div className="sm:col-span-2">
                <h4 className="flex items-center gap-1.5 !text-sm font-medium text-muted uppercase tracking-wider">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
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
              <div className="mt-2 flex flex-wrap gap-3">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-warm-sand px-3 py-1.5 text-sm text-deep-umber hover:bg-warm-sand/20 transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
                {member.twitterUrl && (
                  <a
                    href={member.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-warm-sand px-3 py-1.5 text-sm text-deep-umber hover:bg-warm-sand/20 transition-colors"
                    aria-label="Twitter/X profile"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X
                  </a>
                )}
                {member.websiteUrl && (
                  <a
                    href={member.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-warm-sand px-3 py-1.5 text-sm text-deep-umber hover:bg-warm-sand/20 transition-colors"
                    aria-label="Personal website"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
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
