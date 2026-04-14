"use client"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const RegisterForm = () => {
   const router = useRouter()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
    })

    const onSubmit = async (data: RegisterInput) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                }),
            });

            const resultData = await res.json();
            if (!res.ok) throw new Error(resultData.error.message);

            toast.success("Account created! Now complete your profile.");

            // Log in immediately so the user has a JWT for the next step
            const resLogin = await signIn("credentials", {
                redirect: false,
                identifier: data.email,
                password: data.password,
                callbackUrl: "/complete-profile"
            });

            if(!resLogin?.ok){
                toast.error(resLogin?.error);
            } else {
                toast.success("Account created! Now complete your profile.");
                router.push("/complete-profile");
                router.refresh();
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        }
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-xl ">
        {/* name */}
        <div className="flex flex-col gap-2">
        <Input {...register("username")} type="text" placeholder="Name" />
        {errors.username && <p className="text-error text-xs">{errors.username.message}</p>}
        </div>
        
        {/* email */}
        <div className="flex flex-col gap-2">
        <Input {...register("email")} type="email" placeholder="Email" />
        {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
        </div>
        
        {/* password */}
        <div className="flex flex-col gap-2">
        <Input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
        </div>
        
        {/* confirm password */}
        <div className="flex flex-col gap-2">
        <Input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
        {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword.message}</p>}
        </div>
        
        <Button type="submit" variant={"default"} className="w-full bg-primary" disabled={isSubmitting}>{isSubmitting ? "Processing..." : "Sign Up"}</Button>
    </form>
  )
}

export default RegisterForm