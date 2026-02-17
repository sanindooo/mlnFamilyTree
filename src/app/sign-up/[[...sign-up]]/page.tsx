import { Waitlist } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center py-16">
			<Waitlist signInUrl="/sign-in" />
		</div>
	);
}
