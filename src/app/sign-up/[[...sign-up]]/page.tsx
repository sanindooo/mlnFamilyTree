"use client";

import { useEffect, useRef, useState } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";

import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { waitlistJoinSchema, type WaitlistJoinInput } from "@/lib/validations/waitlist";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get("__clerk_ticket");

  if (ticket) {
    return <InvitationSignUp ticket={ticket} />;
  }

  return <WaitlistJoinForm />;
}

// ─── Waitlist Join Form ─────────────────────────────────────────────────────

function WaitlistJoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistJoinInput>({
    resolver: zodResolver(waitlistJoinSchema),
  });

  const onSubmit = async (data: WaitlistJoinInput) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else if (res.status === 409) {
        toast.info(result.message);
        setIsSubmitted(true);
      } else {
        toast.error(result.errors?.fieldErrors ? "Please fix the errors below" : "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-warm-sand bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-antique-gold/10">
              <svg className="size-8 text-antique-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="!text-2xl text-deep-umber">You&apos;re on the List!</h1>
            <p className="mt-3 !text-sm text-muted leading-relaxed">
              Thank you for your interest in the MLN Museum members area.
              We&apos;ll review your request and send you an invitation email
              once you&apos;ve been approved.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="text-sm font-medium text-burgundy hover:text-burgundy/80"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-warm-sand bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="!text-2xl !md:text-3xl text-deep-umber">
              Join the Waitlist
            </h1>
            <p className="mt-2 !text-sm text-muted">
              Request access to the MLN Museum members area
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-deep-umber">
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="Your full name"
                autoComplete="name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-deep-umber">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="familyConnection" className="mb-1.5 block text-sm font-medium text-deep-umber">
                Connection to the Family
              </label>
              <textarea
                id="familyConnection"
                className="flex min-h-[80px] w-full rounded-md border border-warm-sand bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2"
                placeholder="How are you connected to the Nsibirwa family?"
                {...register("familyConnection")}
              />
              {errors.familyConnection && (
                <p className="mt-1 text-sm text-red-600">{errors.familyConnection.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request Access"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-burgundy hover:text-burgundy/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Invitation Sign-Up (Multi-Step) ────────────────────────────────────────

const signUpStep1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Step1Input = z.infer<typeof signUpStep1Schema>;

const signUpStep2Schema = z.object({
  familyConnection: z.string().min(1, "Family connection is required"),
  location: z.string().min(1, "Location is required"),
  aboutMe: z.string().optional(),
  interests: z.string().optional(),
  profession: z.string().optional(),
});

type Step2Input = z.infer<typeof signUpStep2Schema>;

function InvitationSignUp({ ticket }: { ticket: string }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [completingProfile, setCompletingProfile] = useState(false);
  const completingProfileRef = useRef(false);
  const [userName, setUserName] = useState({ firstName: "", lastName: "" });

  // Redirect if already signed in, but NOT if completing profile after Step 1.
  // Uses ref (synchronous) to win the race against Clerk's async isSignedIn update.
  useEffect(() => {
    if (isSignedIn && !completingProfileRef.current) {
      router.push("/members/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) return null;
  if (isSignedIn && !completingProfile) return null;

  if (ticketError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-warm-sand bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-50">
              <svg className="size-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="!text-2xl text-deep-umber">Invitation Expired</h1>
            <p className="mt-3 !text-sm text-muted leading-relaxed">
              {ticketError}
            </p>
            <div className="mt-6">
              <Link
                href="/sign-up"
                className="text-sm font-medium text-burgundy hover:text-burgundy/80"
              >
                Request a new invitation
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-warm-sand bg-white p-8 shadow-sm">
          {/* Step indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${step >= 1 ? "bg-burgundy text-white" : "bg-warm-sand/30 text-muted"}`}>
              1
            </div>
            <div className="h-0.5 w-8 bg-warm-sand" />
            <div className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${step >= 2 ? "bg-burgundy text-white" : "bg-warm-sand/30 text-muted"}`}>
              2
            </div>
          </div>

          {step === 1 && (
            <Step1Form
              ticket={ticket}
              isLoaded={isLoaded}
              signUp={signUp}
              setActive={setActive}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onBeforeActivate={() => {
                completingProfileRef.current = true; // synchronous — wins the race
                setCompletingProfile(true); // for render guard
              }}
              onComplete={(firstName, lastName) => {
                setUserName({ firstName, lastName });
                setStep(2);
              }}
              onError={setTicketError}
            />
          )}

          {step === 2 && (
            <Step2Form
              userName={userName}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Step1Form({
  ticket,
  isLoaded,
  signUp,
  setActive,
  isSubmitting,
  setIsSubmitting,
  onBeforeActivate,
  onComplete,
  onError,
}: {
  ticket: string;
  isLoaded: boolean | undefined;
  signUp: ReturnType<typeof useSignUp>["signUp"];
  setActive: ReturnType<typeof useSignUp>["setActive"];
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  onBeforeActivate: () => void;
  onComplete: (firstName: string, lastName: string) => void;
  onError: (msg: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Input>({
    resolver: zodResolver(signUpStep1Schema),
  });

  const onSubmit = async (data: Step1Input) => {
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);

    try {
      const result = await signUp.create({
        strategy: "ticket",
        ticket,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });

      if (result.status === "complete" && result.createdSessionId && setActive) {
        onBeforeActivate(); // suppress isSignedIn redirect BEFORE setActive
        await setActive({ session: result.createdSessionId });
        onComplete(data.firstName, data.lastName);
      } else {
        toast.error("Additional verification may be required. Please contact the administrator.");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const code = err.errors[0]?.code;
        if (
          code === "form_identifier_not_found" ||
          code === "ticket_invalid" ||
          code === "form_param_format_invalid"
        ) {
          onError(
            "This invitation link has expired or has already been used. Please contact the site administrator to request a new invitation."
          );
        } else {
          toast.error(err.errors[0]?.longMessage || "Something went wrong");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="!text-2xl text-deep-umber">Create Your Account</h1>
        <p className="mt-2 !text-sm text-muted">Step 1: Set up your credentials</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-deep-umber">
              First Name
            </label>
            <Input id="firstName" placeholder="First name" autoComplete="given-name" {...register("firstName")} />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-deep-umber">
              Last Name
            </label>
            <Input id="lastName" placeholder="Last name" autoComplete="family-name" {...register("lastName")} />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-deep-umber">
            Password
          </label>
          <PasswordInput id="password" placeholder="At least 8 characters" autoComplete="new-password" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-deep-umber">
            Confirm Password
          </label>
          <PasswordInput id="confirmPassword" placeholder="Confirm your password" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <div id="clerk-captcha" />

        <Button type="submit" className="w-full" disabled={isSubmitting || !isLoaded}>
          {isSubmitting ? "Creating account..." : "Continue"}
        </Button>
      </form>
    </>
  );
}

function Step2Form({
  userName,
  isSubmitting,
  setIsSubmitting,
}: {
  userName: { firstName: string; lastName: string };
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Input>({
    resolver: zodResolver(signUpStep2Schema),
  });

  // User is already authenticated from Step 1 (setActive called there)
  const onSubmit = async (data: Step2Input) => {
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: `${userName.firstName} ${userName.lastName}`.trim(),
        ...data,
      };

      const res = await fetch("/api/profiles/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/members/dashboard");
      } else {
        toast.error("Failed to save profile. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="!text-2xl text-deep-umber">Complete Your Profile</h1>
        <p className="mt-2 !text-sm text-muted">Step 2: Tell us about yourself</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="familyConnection" className="mb-1.5 block text-sm font-medium text-deep-umber">
            Connection to the Family <span className="text-red-500">*</span>
          </label>
          <textarea
            id="familyConnection"
            className="flex min-h-[80px] w-full rounded-md border border-warm-sand bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2"
            placeholder="e.g., Grandchild of Martin Luther Nsibirwa"
            {...register("familyConnection")}
          />
          {errors.familyConnection && <p className="mt-1 text-sm text-red-600">{errors.familyConnection.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-deep-umber">
            Location <span className="text-red-500">*</span>
          </label>
          <Input id="location" placeholder="City, Country" {...register("location")} />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="profession" className="mb-1.5 block text-sm font-medium text-deep-umber">
            Profession
          </label>
          <Input id="profession" placeholder="Your profession (optional)" {...register("profession")} />
        </div>

        <div>
          <label htmlFor="aboutMe" className="mb-1.5 block text-sm font-medium text-deep-umber">
            About Me
          </label>
          <textarea
            id="aboutMe"
            className="flex min-h-[80px] w-full rounded-md border border-warm-sand bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2"
            placeholder="Tell us a bit about yourself (optional)"
            {...register("aboutMe")}
          />
        </div>

        <div>
          <label htmlFor="interests" className="mb-1.5 block text-sm font-medium text-deep-umber">
            Interests
          </label>
          <Input id="interests" placeholder="Your interests (optional)" {...register("interests")} />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Completing setup..." : "Complete Sign Up"}
        </Button>
      </form>
    </>
  );
}
