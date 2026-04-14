"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import contactUsSchema from "@/lib/validations/contactus"
import { useState } from "react"
import { z } from "zod"

const ContactUsForm = ({fetchUrl}: {fetchUrl: string}) => {

  type ContactUsFormValues = z.infer<typeof contactUsSchema>
  const { register, handleSubmit, formState: { errors }, reset } = useForm <ContactUsFormValues> ({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<ContactUsFormValues> = async (data) => {
  const sumbitPromise = fetch(fetchUrl, {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
  }).then((res) => {
  if (!res.ok) {
    throw new Error("Failed to send message")
  }
  return res.json()
  }).catch((error) => {
    console.log(error)
    throw new Error("Failed to send message")
  }).finally(() => {
    setLoading(false)
    reset()
  })

  toast.promise(sumbitPromise, {
    loading: "Sending message...",
    success: "Message sent successfully",
    error: "Failed to send message",
  })

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full min-w-xl">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-full">
                <Input {...register("firstName")} id="first-name" type="text" placeholder="First Name" className={cn("w-full", errors.firstName && "border-error placeholder:text-error text-error")} />
            {errors.firstName && <p className="text-error text-xs">{errors.firstName.message}</p>}
            </div>

            <div className="flex flex-col gap-2 w-full">
                <Input {...register("lastName")} id="last-name" type="text" placeholder="Last Name" className={cn("w-full", errors.lastName && "border-error placeholder:text-error text-error")} />
            {errors.lastName && <p className="text-error text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Input {...register("email")} id="email" type="email" placeholder="Email" className={cn("w-full", errors.email && "border-error placeholder:text-error text-error")} />
            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Input {...register("phone")} id="phone" type="text" placeholder="Phone" className={cn("w-full", errors.phone && "border-error placeholder:text-error text-error")} />
            {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Input {...register("subject")} id="subject" type="text" placeholder="Subject" className={cn("w-full", errors.subject && "border-error placeholder:text-error text-error")} />
            {errors.subject && <p className="text-error text-xs">{errors.subject.message}</p>}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Textarea {...register("message")} id="message" placeholder="Message" className={cn("w-full min-h-40", errors.message && "border-error placeholder:text-error text-error")} />
            {errors.message && <p className="text-error text-xs">{errors.message.message}</p>}
          </div>

          <Button type="submit" className="w-fit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
        </form>
  )
}

export default ContactUsForm