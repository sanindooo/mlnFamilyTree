import crypto from "crypto";

/**
 * Generate a URL-friendly slug from a name.
 * Appends an 8-char random suffix to ensure uniqueness.
 * e.g. "John Smith" → "john-smith-a3f2b1c9"
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return `${base || "member"}-${suffix}`;
}
