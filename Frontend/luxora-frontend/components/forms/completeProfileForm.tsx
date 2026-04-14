"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form"; // Added Controller
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CompleteProfileInput, completeProfileSchema } from "@/lib/validations/complete-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

const CompleteProfileForm = () => {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    control, // Added control
    formState: { errors, isSubmitting } 
  } = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      user_type: "Buyer",
      phone: "",
      terms: false,
    }
  });

  // 1. Handle the loading state so it doesn't error out on refresh
  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading Session...</div>;
  }

  // 2. Only show the error if loading is finished and there is still no user
  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p>Session expired or not found.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  const onSubmit: SubmitHandler<CompleteProfileInput> = async (data) => {
    if (!session?.user?.id || !session?.user?.jwt) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${session.user.jwt}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_type: data.user_type,
          phone: data.phone,
          terms: data.terms
        }),
      });

      if (res.ok) {
        toast.success("Profile completed!");
        await update({ 
          ...session,
          user: { ...session.user, user_type: data.user_type }
        });
        router.push(data.user_type === "Agent" ? "/agent" : "/buyer");
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.error?.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full max-w-sm p-6 rounded-lg shadow-md bg-card">
        <h1 className="text-xl font-bold text-center">Finish Setting Up</h1>
        
        {/* User Type (RadioGroup Fix) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">I am a...</label>
          <Controller
            name="user_type"
            control={control}
            render={({ field }) => (
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value} 
                className="flex flex-row gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Buyer" id="buyer"/>
                  <label htmlFor="buyer">Buyer</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Agent" id="agent"/>
                  <label htmlFor="agent">Agent</label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.user_type && <p className="text-error text-xs">{errors.user_type.message}</p>}
        </div>

        {/* Phone Number (Input works with register) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input type="tel" placeholder="+20 123 456 789" {...register("phone")} />
          {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
        </div>

        {/* Terms (Checkbox Fix) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  id="terms"
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              )}
            />
            <label htmlFor="terms" className="text-sm font-medium">
              I agree to the terms and conditions
            </label>
          </div>
          {errors.terms && <p className="text-error text-xs">{errors.terms.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Start Using Luxora"}
        </Button>
      </form>
    </main>
  );
}

export default CompleteProfileForm;