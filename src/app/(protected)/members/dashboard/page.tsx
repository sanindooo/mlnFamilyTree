"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { getInitials } from "@/lib/utils/initials";

import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/profile";
import type { SelectUserProfile } from "@/lib/db/schema";

export default function MembersPage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<SelectUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [needsCompletion, setNeedsCompletion] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    fetchProfile();
  }, [isLoaded]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profiles/me");
      if (res.ok) {
        setProfile(await res.json());
        setNeedsCompletion(false);
      } else if (res.status === 404) {
        setNeedsCompletion(true);
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <section className="container py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-warm-sand/30" />
          <div className="h-4 w-64 rounded bg-warm-sand/30" />
          <div className="mt-8 h-64 max-w-2xl rounded-xl bg-warm-sand/20" />
        </div>
      </section>
    );
  }

  if (needsCompletion) {
    return <ProfileCompletionForm user={user} onComplete={fetchProfile} />;
  }

  if (editing && profile) {
    return (
      <ProfileEditForm
        profile={profile}
        user={user}
        onCancel={() => setEditing(false)}
        onSave={(updated) => {
          setProfile(updated);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <section className="container py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="mt-2 text-muted">
            Manage your profile and account settings
          </p>
        </div>
        <Button onClick={() => setEditing(true)} variant="secondary" size="sm">
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <div className="rounded-xl border border-warm-sand bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              profilePhotoUrl={profile?.profilePhotoUrl}
              clerkImageUrl={user?.imageUrl}
              name={profile?.fullName || user?.fullName}
              size={64}
            />
            <div>
              <h3 className="!text-lg">
                {profile?.fullName || user?.fullName || "Family Member"}
              </h3>
              <p className="text-sm text-muted">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              {profile?.familyConnection && (
                <p className="mt-1 text-sm text-antique-gold">
                  {profile.familyConnection}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ProfileField label="Location" value={profile?.location} />
            <ProfileField label="About Me" value={profile?.aboutMe} />
            <ProfileField label="Interests" value={profile?.interests} />
            <ProfileField label="Profession" value={profile?.profession} />
            <ProfileField label="Company" value={profile?.company} />
          </div>

          {/* Social Links */}
          {(profile?.linkedinUrl || profile?.twitterUrl || profile?.websiteUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-burgundy hover:text-burgundy/80">
                  LinkedIn
                </a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-burgundy hover:text-burgundy/80">
                  Twitter
                </a>
              )}
              {profile.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-burgundy hover:text-burgundy/80">
                  Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Settings Card */}
        <div className="space-y-6">
          {/* Visibility Toggle */}
          <div className="rounded-xl border border-warm-sand bg-white p-6 shadow-sm">
            <h4 className="!text-base font-medium">Directory Visibility</h4>
            <p className="mt-1 text-sm text-muted">
              Control whether your profile appears in the members directory.
            </p>
            <VisibilityToggle
              isVisible={profile?.isVisibleInDirectory ?? true}
              onChange={(val) => {
                if (profile) {
                  setProfile({ ...profile, isVisibleInDirectory: val });
                }
              }}
            />
          </div>

          {/* Password Change */}
          <PasswordChangeSection />

          {/* Photo Upload */}
          <PhotoUploadSection
            currentUrl={profile?.profilePhotoUrl}
            onUploaded={(url) => {
              if (profile) {
                setProfile({ ...profile, profilePhotoUrl: url });
              }
            }}
          />

          {/* Quick Links */}
          <div className="rounded-xl border border-warm-sand bg-white p-6 shadow-sm">
            <h4 className="!text-base font-medium">Quick Links</h4>
            <div className="mt-3 space-y-2">
              <Link
                href="/members"
                className="block text-sm text-burgundy hover:text-burgundy/80"
              >
                View Members Directory
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function ProfileField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <h6 className="!text-xs text-muted !uppercase !tracking-wider">{label}</h6>
      {value ? (
        <p className="!text-sm text-deep-umber">{value}</p>
      ) : (
        <p className="!text-sm text-deep-umber/40 italic">Not yet provided</p>
      )}
    </div>
  );
}

function ProfileAvatar({
  profilePhotoUrl,
  clerkImageUrl,
  name,
  size = 64,
}: {
  profilePhotoUrl?: string | null;
  clerkImageUrl?: string;
  name?: string | null;
  size?: number;
}) {
  const src = profilePhotoUrl || clerkImageUrl;
  const initials = getInitials(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={name || "Profile"}
        width={size}
        height={size}
        className="rounded-full border-2 border-antique-gold object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-antique-gold bg-warm-sand/30 font-medium text-deep-umber"
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      {initials}
    </div>
  );
}

function VisibilityToggle({
  isVisible,
  onChange,
}: {
  isVisible: boolean;
  onChange: (val: boolean) => void;
}) {
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const newValue = !isVisible;
    onChange(newValue); // Optimistic

    setSaving(true);
    try {
      const res = await fetch("/api/profiles/me/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisibleInDirectory: newValue }),
      });

      if (!res.ok) {
        onChange(!newValue); // Rollback
        toast.error("Failed to update visibility");
      }
    } catch {
      onChange(!newValue); // Rollback
      toast.error("Failed to update visibility");
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className="mt-3 flex items-center gap-3 cursor-pointer"
      role="switch"
      aria-checked={isVisible}
    >
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${
          isVisible ? "bg-burgundy" : "bg-warm-sand"
        }`}
      >
        <div
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            isVisible ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-deep-umber">
        {isVisible ? "Visible in directory" : "Hidden from directory"}
      </span>
    </button>
  );
}

function PasswordChangeSection() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      await user?.updatePassword({
        currentPassword,
        newPassword,
        signOutOfOtherSessions: true,
      });
      toast.success("Password updated successfully");
      setIsOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update password";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-warm-sand bg-white p-6 shadow-sm">
      <h4 className="!text-base font-medium">Password</h4>
      {!isOpen ? (
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => setIsOpen(true)}
        >
          Change Password
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <PasswordInput
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <PasswordInput
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <PasswordInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Updating..." : "Update Password"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function PhotoUploadSection({
  currentUrl,
  onUploaded,
}: {
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onUploaded(url);
        toast.success("Profile photo updated");
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
        setPreview(null);
      }
    } catch {
      toast.error("Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-warm-sand bg-white p-6 shadow-sm">
      <h4 className="!text-base font-medium">Profile Photo</h4>
      <div className="mt-3 flex items-center gap-4">
        {(preview || currentUrl) && (
          <Image
            src={preview || currentUrl!}
            alt="Profile photo"
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-antique-gold object-cover"
          />
        )}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </Button>
          <p className="mt-1 text-xs text-muted">JPEG, PNG, or WebP. Max 5MB.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Edit Form ──────────────────────────────────────────────────────

function ProfileEditForm({
  profile,
  user,
  onCancel,
  onSave,
}: {
  profile: SelectUserProfile;
  user: ReturnType<typeof useUser>["user"];
  onCancel: () => void;
  onSave: (profile: SelectUserProfile) => void;
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: profile.fullName,
      familyConnection: profile.familyConnection,
      location: profile.location,
      aboutMe: profile.aboutMe || "",
      interests: profile.interests || "",
      profession: profile.profession || "",
      company: profile.company || "",
      phone: profile.phone || "",
      linkedinUrl: profile.linkedinUrl || "",
      twitterUrl: profile.twitterUrl || "",
      websiteUrl: profile.websiteUrl || "",
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setSaving(true);
    try {
      // Update DB
      const res = await fetch("/api/profiles/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to update profile");
        return;
      }

      const updated = await res.json();

      // Sync name with Clerk
      if (data.fullName && user) {
        const parts = data.fullName.split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";
        try {
          await user.update({ firstName, lastName });
        } catch {
          // Non-critical: Clerk name sync failed
        }
      }

      toast.success("Profile updated successfully");
      onSave(updated);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1>Edit Profile</h1>
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-6 rounded-xl border border-warm-sand bg-white p-8 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input {...register("fullName")} />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                Family Connection <span className="text-red-500">*</span>
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-warm-sand bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2"
                {...register("familyConnection")}
              />
              {errors.familyConnection && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.familyConnection.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                Location <span className="text-red-500">*</span>
              </label>
              <Input placeholder="City, Country" {...register("location")} />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                Profession
              </label>
              <Input {...register("profession")} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                Company
              </label>
              <Input {...register("company")} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                Phone
              </label>
              <Input type="tel" {...register("phone")} />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                Interests
              </label>
              <Input placeholder="Your interests" {...register("interests")} />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                About Me
              </label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-warm-sand bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2"
                {...register("aboutMe")}
              />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="!text-base font-medium mb-4">Social Links</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                  LinkedIn URL
                </label>
                <Input
                  placeholder="https://linkedin.com/in/..."
                  {...register("linkedinUrl")}
                />
                {errors.linkedinUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.linkedinUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                  Twitter/X URL
                </label>
                <Input
                  placeholder="https://x.com/..."
                  {...register("twitterUrl")}
                />
                {errors.twitterUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.twitterUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-deep-umber">
                  Website URL
                </label>
                <Input
                  placeholder="https://..."
                  {...register("websiteUrl")}
                />
                {errors.websiteUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ─── Profile Completion Form (for users without DB record) ──────────────────

function ProfileCompletionForm({
  user,
  onComplete,
}: {
  user: ReturnType<typeof useUser>["user"];
  onComplete: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Profile created!");
        onComplete();
      } else {
        toast.error("Failed to save profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <h1>Complete Your Profile</h1>
          <p className="mt-2 text-muted">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-4 rounded-xl border border-warm-sand bg-white p-8 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-deep-umber">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input {...register("fullName")} />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-deep-umber">
              Connection to the Family <span className="text-red-500">*</span>
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-warm-sand bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2"
              placeholder="e.g., Grandchild of Martin Luther Nsibirwa"
              {...register("familyConnection")}
            />
            {errors.familyConnection && (
              <p className="mt-1 text-sm text-red-600">
                {errors.familyConnection.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-deep-umber">
              Location <span className="text-red-500">*</span>
            </label>
            <Input placeholder="City, Country" {...register("location")} />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </div>
    </section>
  );
}
