import { z } from "zod";

export const profileSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  bio: z.string().max(160).optional(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional().default({})
});

export type ProfileValues = z.infer<typeof profileSchema>;