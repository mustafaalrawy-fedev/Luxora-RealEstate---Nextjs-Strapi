import * as z from "zod";

export const inquirySchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // Correct way to handle string OR number
  property: z.union([z.string(), z.number()]),
  agent: z.union([z.string(), z.number()]),
  inquiry_status: z.enum(["New", "Contacted", "Closed"]).default("New"),
});

export type InquiryValues = z.infer<typeof inquirySchema>;