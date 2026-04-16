"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";

const inquirySchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface InquiryFormProps {
  propertyId: number;
  agentId: number;
}

export const InquiryForm = ({ propertyId, agentId }: InquiryFormProps) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: { message: string }) => {
    if (!session) {
      toast.error("Please login to send an inquiry");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/inquiries", {
        data: {
          message: data.message,
          property: propertyId,
          agent: agentId,
          buyer: session.user.id,
          status: "pending",
        },
      });

      toast.success("Inquiry sent to the agent!");
      reset();
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 border rounded-2xl bg-card/50 backdrop-blur-sm border-primary/10">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-primary" size={20} />
        <h3 className="font-semibold text-lg">Interested in this property?</h3>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea 
          {...register("message")}
          placeholder="Ask the agent about pricing, viewing times, or specific details..."
          className="min-h-[120px] bg-background/50 resize-none rounded-xl"
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message as string}</p>
        )}

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-primary hover:bg-primary/90 rounded-xl py-6"
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