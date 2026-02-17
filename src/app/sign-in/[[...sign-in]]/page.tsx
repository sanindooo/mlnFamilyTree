"use client";

import { useEffect, useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
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

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInInput = z.infer<typeof signInSchema>;

const verificationSchema = z.object({
  code: z
    .string()
    .min(6, "Please enter the 6-digit code")
    .max(6, "Code must be 6 digits"),
});

type VerificationInput = z.infer<typeof verificationSchema>;

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect_url") || "/members/dashboard";
  // Prevent open redirect — only allow paths under known prefixes
  const redirectUrl = (() => {
    const ALLOWED_PREFIXES = ["/members", "/admin"];
    if (!rawRedirect.startsWith("/") || rawRedirect.startsWith("//")) return "/members/dashboard";
    try {
      const decoded = decodeURIComponent(rawRedirect);
      if (decoded.startsWith("//") || decoded.includes("\\")) return "/members/dashboard";
    } catch {
      return "/members/dashboard";
    }
    return ALLOWED_PREFIXES.some((p) => rawRedirect.startsWith(p))
      ? rawRedirect
      : "/members/dashboard";
  })();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Redirect authenticated users away from sign-in page
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(redirectUrl);
    }
  }, [isLoaded, isSignedIn, router, redirectUrl]);

  if (!isLoaded) return null;
  if (isSignedIn) return null;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-warm-sand bg-white p-8 shadow-sm">
          {needsVerification ? (
            <VerificationForm
              signIn={signIn}
              setActive={setActive}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              userEmail={userEmail}
              redirectUrl={redirectUrl}
              onBack={() => setNeedsVerification(false)}
            />
          ) : (
            <CredentialsForm
              signIn={signIn}
              setActive={setActive}
              isLoaded={isLoaded}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              redirectUrl={redirectUrl}
              onNeedsVerification={(email) => {
                setUserEmail(email);
                setNeedsVerification(true);
              }}
            />
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-burgundy hover:text-burgundy/80"
              >
                Join the waitlist
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Credentials Form ─────────────────────────────────────────────────────────

function CredentialsForm({
  signIn,
  setActive,
  isLoaded,
  isSubmitting,
  setIsSubmitting,
  redirectUrl,
  onNeedsVerification,
}: {
  signIn: ReturnType<typeof useSignIn>["signIn"];
  setActive: ReturnType<typeof useSignIn>["setActive"];
  isLoaded: boolean;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  redirectUrl: string;
  onNeedsVerification: (email: string) => void;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    if (!signIn) return;
    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete" && result.createdSessionId && setActive) {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else if (result.status === "needs_second_factor") {
        // Client Trust or user-enabled MFA — prepare email code verification
        await signIn.prepareSecondFactor({ strategy: "email_code" });
        onNeedsVerification(data.email);
      } else {
        toast.error("Sign in could not be completed. Please try again.");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const message =
          err.errors[0]?.longMessage ||
          err.errors[0]?.message ||
          "Invalid email or password";
        toast.error(message);
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
        <h1 className="!text-2xl !md:text-3xl text-deep-umber">
          Welcome Back
        </h1>
        <p className="mt-2 !text-sm text-muted">
          Sign in to access the members area
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-deep-umber"
          >
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
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-deep-umber"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isLoaded}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </>
  );
}

// ─── Email Verification Form (Client Trust / MFA) ────────────────────────────

function VerificationForm({
  signIn,
  setActive,
  isSubmitting,
  setIsSubmitting,
  userEmail,
  redirectUrl,
  onBack,
}: {
  signIn: ReturnType<typeof useSignIn>["signIn"];
  setActive: ReturnType<typeof useSignIn>["setActive"];
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  userEmail: string;
  redirectUrl: string;
  onBack: () => void;
}) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationInput>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmit = async (data: VerificationInput) => {
    if (!signIn) return;
    setIsSubmitting(true);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: data.code,
      });

      if (result.status === "complete" && result.createdSessionId && setActive) {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else {
        toast.error("Verification could not be completed. Please try again.");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const message =
          err.errors[0]?.longMessage ||
          err.errors[0]?.message ||
          "Invalid verification code";
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!signIn) return;
    setIsResending(true);

    try {
      await signIn.prepareSecondFactor({ strategy: "email_code" });
      toast.success("A new code has been sent to your email.");
    } catch {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-antique-gold/10">
          <svg
            className="size-8 text-antique-gold"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h1 className="!text-2xl text-deep-umber">Check Your Email</h1>
        <p className="mt-2 !text-sm text-muted leading-relaxed">
          We sent a verification code to{" "}
          <span className="font-medium text-deep-umber">{userEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="code"
            className="mb-1.5 block text-sm font-medium text-deep-umber"
          >
            Verification Code
          </label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            autoComplete="one-time-code"
            maxLength={6}
            {...register("code")}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">
              {errors.code.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify & Sign In"}
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted hover:text-deep-umber"
        >
          Back to sign in
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-sm font-medium text-burgundy hover:text-burgundy/80 disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend code"}
        </button>
      </div>
    </>
  );
}
