"use client"

import MainHeading from "../shared/MainHeading"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { User } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LoginForm = () => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginInput) => {
        const res = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        if (res?.error) {
            toast.error(res.error);
        } else {

            toast.success("Login successful");

            // get user type from session
            const session = await getSession();
            const userType = session?.user?.user_type; // buyer or agent
            // this code after i added middleware.ts
            if (userType === "Agent") router.push("/agent");
            else router.push("/buyer");

            router.refresh();
        }
    }

  return (
   <article className="container-space w-full h-full flex flex-col justify-center items-center relative">
        <User className="text-primary mb-5" size={48} strokeWidth={1.5} />
        <div className="w-full flex justify-center text-center">
            <MainHeading title="Login" description="Login to your account" showButton={false} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-xl ">
            <div className="flex flex-col gap-2">
                <Input {...register("identifier")} type="email" placeholder="Email" />
                {errors.identifier && <p className="text-error text-xs">{errors.identifier.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
                <Input {...register("password")} type="password" placeholder="Password" />
                {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <div className="flex items-center gap-2.5">
                <p className="text-left text-sm text-muted-foreground tracking-wider">Forgot your password? </p>
                <Link href="/forgot-password" className="text-primary font-semibold hover:underline">Forgot Password?</Link>
            </div>
        </form>
        <div className="flex items-center gap-2.5 justify-center absolute bottom-10 w-full">
            <p className="text-left text-sm text-muted-foreground tracking-wider">Don&apos;t have an account? </p>
            <Link href="/register" className="text-primary font-semibold hover:underline text-sm">Sign Up</Link>
        </div>
    </article>
  )
}

export default LoginForm
