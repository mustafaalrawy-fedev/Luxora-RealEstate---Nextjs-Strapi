import { z } from "zod";

export const loginSchema = z.object({
    identifier: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type LoginInput = z.infer<typeof loginSchema>


export const registerSchema = z.object({
  username: z.string().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
//   user_type: z.enum(["Buyer", "Agent"]),
//   phone: z.string().min(1, "Phone number is required").min(10, "Invalid phone number"),
//   terms: z.boolean().refine((value) => value === true, {
//     message: "You must agree to the terms and conditions",
//   }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;