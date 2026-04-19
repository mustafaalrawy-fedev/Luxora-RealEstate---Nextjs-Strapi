"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { inquirySchema, type InquiryValues } from "@/lib/validations/inquiry";
import { Input } from "@/components/ui/input";


export default function InquiryForm({ propertyId, agentId }: { propertyId: number | string, agentId: number | string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
  resolver: zodResolver(inquirySchema),
  defaultValues: {
    full_name: "",
    email: "",
    phone: "",
    message: "",
    property: propertyId, // Pass them here directly
    agent: agentId,       // Pass them here directly
    inquiry_status: "New",
  },
});

// 2. Use useEffect to ensure values stay synced if the props change
useEffect(() => {
  setValue("property", propertyId);
  setValue("agent", agentId);
}, [propertyId, agentId, setValue]);

  const onSubmit = async (data: InquiryValues) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/inquiries", {
        data: {
          full_name:          data.full_name,
          email:             data.email,
          phone:             data.phone,
          message:           data.message,
          property:          data.property,
          agent:             data.agent,
          inquiry_status:    data.inquiry_status,
        },
      });

      toast.success("Inquiry sent to the agent!");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-7 border rounded-2xl bg-card/50 backdrop-blur-sm border-primary/10 mt-56">
      {/* Agent Info */}
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="text-primary" size={20} />
        <h3 className="font-semibold text-lg">Interested in this property?</h3>
      </div>

      {/* Inquiry Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        <input type="hidden" {...register("property")} value={propertyId} />
        <input type="hidden" {...register("agent")} value={agentId} />
        <input type="hidden" {...register("inquiry_status")} value="New" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="full_name">Full Name</label>
            <Input
              id="full_name"
              type="text"
              {...register("full_name")}
              placeholder="Your full name"
              className="rounded-xl"
            />
            {errors.full_name && (
              <p className="text-xs text-destructive">{errors.full_name.message as string}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Your email address"
              className="rounded-xl"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message as string}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="phone">Phone</label>
          <Input
            id="phone"
            type="text"
            {...register("phone")}
            placeholder="Your phone number"
            className="rounded-xl"
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message as string}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="message">Message</label>
          <Textarea 
            {...register("message")}
            placeholder="Ask the agent about pricing, viewing times, or specific details..."
            className="min-h-[120px] bg-background/50 resize-none rounded-xl"
          />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message as string}</p>
        )}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-fit bg-primary hover:bg-primary/90 rounded-xl"
        >
          {isSubmitting ? "Sending..." : (
            <span className="flex items-center gap-2">
              Send Inquiry <Send size={16} />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};