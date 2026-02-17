import { z } from "zod";

const safeUrl = z
  .string()
  .url("Please enter a valid URL")
  .refine((val) => val.startsWith("https://") || val.startsWith("http://"), {
    message: "URL must use http or https",
  });

export const profileCreateSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  familyConnection: z.string().min(1, "Family connection is required").max(500),
  location: z.string().min(1, "Location is required").max(200),
  aboutMe: z.string().max(2000).optional(),
  interests: z.string().max(500).optional(),
  profession: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  linkedinUrl: safeUrl.optional().or(z.literal("")),
  twitterUrl: safeUrl.optional().or(z.literal("")),
  websiteUrl: safeUrl.optional().or(z.literal("")),
});

export const profileUpdateSchema = profileCreateSchema.partial();

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
