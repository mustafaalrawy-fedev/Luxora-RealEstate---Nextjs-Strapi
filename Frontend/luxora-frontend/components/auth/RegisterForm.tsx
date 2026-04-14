"use client"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const RegisterForm = () => {
    const router = useRouter()
    const {control, register, handleSubmit, formState: {errors, isSubmitting}} = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            user_type: "Buyer",
            phone: "",
            terms: false,
        },
    })

const onSubmit = async (data: RegisterInput) => {
  try {
    // ── Step 1: Register with only the fields Strapi accepts by default ──
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      }
    );

    const resultData = await res.json();
    if (!res.ok) throw new Error(resultData.error?.message ?? "Registration failed");

    const { jwt, user } = resultData;

    // ── Step 2: Update the new user with custom fields using the JWT ──
    const updateRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          phone: data.phone,
          user_type: data.user_type,
          terms: data.terms,
        }),
      }
    );

    if (!updateRes.ok) {
      const updateError = await updateRes.json();
      throw new Error(updateError.error?.message ?? "Profile update failed");
    }

    toast.success("Account created successfully!");

    // ── Step 3: Sign in and redirect ──
    await signIn("credentials", {
      redirect: false,
      identifier: data.email,
      password: data.password,
    });

    window.location.href = data.user_type === "Agent" ? "/agent" : "/buyer";

  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Something went wrong");
    console.error("Submission Error:", error);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-xl ">
        <div className="flex flex-col gap-2">
        <Input {...register("username")} type="text" placeholder="Name" />
        {errors.username && <p className="text-error text-xs">{errors.username.message}</p>}
        </div>
        
        <div className="flex flex-col gap-2">
        <Input {...register("email")} type="email" placeholder="Email" />
        {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
        </div>
        
        <div className="flex flex-col gap-2">
        <Input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
        </div>
        
        <div className="flex flex-col gap-2">
        <Input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
        {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword.message}</p>}
        </div>
        
        <div className="flex flex-col gap-2">
        <Input {...register("phone")} type="text" placeholder="Phone" />
        {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
        </div>
        {/* user roles */}
        {/* Buyer | Agent */}
        {/* <div className="flex items-center gap-5"> */}
        <div>
            <Controller
                name="user_type"
                control={control}
                render={({ field }) => (
                    <RadioGroup
                        {...field}
                        className="flex items-center gap-6"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <div className="flex items-center gap-2.5">
                            <RadioGroupItem value="Buyer" id="buyer" />
                            <label htmlFor="buyer" className="select-none">Buyer</label>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <RadioGroupItem value="Agent" id="agent" />
                            <label htmlFor="agent" className="select-none">Agent</label>
                        </div>
                    </RadioGroup>
                )}
            />
            {errors.user_type && <p className="text-error text-xs">{errors.user_type.message}</p>}
        </div>
        
        <Button type="submit" variant={"default"} className="w-full bg-primary" disabled={isSubmitting}>{isSubmitting ? "Processing..." : "Sign Up"}</Button>
        
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
                <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            id="terms"
                        />
                    )}
                />
                <label htmlFor="terms" className="select-none text-left text-sm text-muted-foreground tracking-wider">I agree to the terms and conditions</label>
            </div>
            {errors.terms && <p className="text-error text-xs">{errors.terms.message}</p>}
        </div>
    </form>
  )
}

export default RegisterForm