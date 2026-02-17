import { z } from "zod";

export const waitlistJoinSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  familyConnection: z.string().min(1, "Please describe your connection to the family"),
});

export type WaitlistJoinInput = z.infer<typeof waitlistJoinSchema>;
