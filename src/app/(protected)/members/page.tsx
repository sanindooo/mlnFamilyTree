"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function MembersPage() {
	const { user } = useUser();

	return (
		<section className="container py-16">
			<h1>Members Area</h1>
			<p className="mt-4 text-muted">
				Welcome to the MLN family members area. This is a preview of what
				the member experience will look like.
			</p>

			{/* Mock Profile Card */}
			<div className="mt-12 max-w-md rounded-xl border border-warm-sand bg-white p-8 shadow-sm">
				<div className="flex items-center gap-4">
					{user?.imageUrl && (
						<Image
							src={user.imageUrl}
							alt={user.fullName || "Profile"}
							width={64}
							height={64}
							className="size-16 rounded-full border-2 border-antique-gold object-cover"
						/>
					)}
					<div>
						<h3 className="text-lg">
							{user?.fullName || "Family Member"}
						</h3>
						<p className="text-sm text-muted">
							{user?.primaryEmailAddress?.emailAddress}
						</p>
					</div>
				</div>

				{/* Placeholder fields */}
				<div className="mt-6 space-y-4">
					<div>
						<h6 className="text-xs text-muted">Location</h6>
						<p className="text-sm text-deep-umber/60 italic">
							Not yet provided
						</p>
					</div>
					<div>
						<h6 className="text-xs text-muted">Interests</h6>
						<p className="text-sm text-deep-umber/60 italic">
							Not yet provided
						</p>
					</div>
					<div>
						<h6 className="text-xs text-muted">About Me</h6>
						<p className="text-sm text-deep-umber/60 italic">
							Not yet provided
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
