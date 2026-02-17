import { z } from "zod";

export const waitlistJoinSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  email: z.string().email("Please enter a valid email address").max(254),
  familyConnection: z.string().min(1, "Please describe your connection to the family").max(500),
});

export type WaitlistJoinInput = z.infer<typeof waitlistJoinSchema>;
