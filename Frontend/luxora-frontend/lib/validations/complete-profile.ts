import { z } from "zod";

// This validates only the inputs from the completion form
export const completeProfileSchema = z.object({
    // user_type: z.enum(["Buyer", "Agent"], {
    //     error: "Please select if you are a Buyer or an Agent",
    // }),
    phone: z.string()
        .min(1, "Phone number is required")
        .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

// This represents the full data required for the Strapi API update
export interface UserUpdatePayload extends CompleteProfileInput {
    id: string;
    jwt: string;
}