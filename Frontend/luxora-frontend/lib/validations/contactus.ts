import { z } from "zod";

const contactUsSchema = z.object({
    firstName: z.string().min(2, "First Name is required"),
    lastName: z.string().min(2, "Last Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone is required"),
    subject: z.string().min(3, "Subject is required"),
    message: z.string().min(10, "Message is required"),
})

export default contactUsSchema