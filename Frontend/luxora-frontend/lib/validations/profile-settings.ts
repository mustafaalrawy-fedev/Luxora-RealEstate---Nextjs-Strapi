import { z } from "zod";

// Helper: accepts any string OR empty/null/undefined — no URL format enforcement
const optionalUrl = z.string().optional().nullable().transform(val => val ?? "");
const optionalString = z.string().optional().nullable().transform(val => val ?? "");

export const profileSchema = z.object({
  avatar: optionalString,

  name: z.string().min(1, "Name is required"),

  // Read-only in the form, so just accept whatever comes in
  email: optionalString,

  // Optional phone — only validate length if something is typed
  phone: z
    .string()
    .optional()
    .nullable()
    .transform(val => val ?? "")
    .refine(val => val === "" || val.length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),

  socialLinks: z.object({
    facebook:  optionalUrl,
    twitter:   optionalUrl,
    instagram: optionalUrl,
    linkedin:  optionalUrl,
  }),

  bio: optionalString,
});

export type ProfileValues = z.infer<typeof profileSchema>;