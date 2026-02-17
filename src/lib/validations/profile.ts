import { z } from "zod";

export const profileCreateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  familyConnection: z.string().min(1, "Family connection is required"),
  location: z.string().min(1, "Location is required"),
  aboutMe: z.string().optional(),
  interests: z.string().optional(),
  profession: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  linkedinUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export const profileUpdateSchema = profileCreateSchema.partial();

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
