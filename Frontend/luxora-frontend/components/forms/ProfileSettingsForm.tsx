"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, Camera } from "lucide-react";
import { profileSchema, ProfileValues } from "@/lib/validations/profile-settings";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useProfile } from "@/hooks/use-profile";

const ProfileSettingsForm = () => {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();

  // 1. Fetch Fresh Data from Strapi
    const { data: userData, isLoading } = useProfile();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatar: "",
      name: "",
      email: "",
      phone: "",
      socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" },
      bio: "",
    },
  });

  console.log(userData);

  // 2. Sync Strapi Data to Form
  useEffect(() => {
    if (userData) {
      reset({
        // Map Strapi's 'username' to our 'name' field
        name: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        // Strapi returns an array for Rich Text bios usually, or a string
        bio: userData?.bio?.[0]?.children?.[0]?.text || "",
        // Map Strapi's 'social_links' to form's 'socialLinks'
        socialLinks: {
          facebook: userData.social_links?.facebook || "",
          twitter: userData.social_links?.twitter || "",
          instagram: userData.social_links?.instagram || "",
          linkedin: userData.social_links?.Linkedin || "", // Note: Strapi has 'Linkedin' capital L
        },
        // Prepend API URL to the relative path from Strapi
        avatar: userData.avatar?.url 
          ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${userData.avatar.url}` 
          : "",
      });
    }
  }, [userData, reset]);

  const onSubmit: SubmitHandler<ProfileValues> = async (data) => {
    try {
      // Note: Strapi users-permissions uses 'social_links' in the DB
      // We map our camelCase form back to underscore for the API
      const payload = {
        ...data,
        username: data.name, // Strapi uses 'username'
        social_links: data.socialLinks, 
      };

      const res = await axiosInstance.put(`/users/${session?.user?.id}`, payload);

      if (res.status !== 200) throw new Error();

      // Update NextAuth local state
      await update({
        ...session,
        user: { ...session?.user, name: data.name },
      });

      // Refresh React Query cache
      queryClient.invalidateQueries({ queryKey: ["user", session?.user?.id] });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during update");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Logic for showing a preview or uploading immediately to Strapi
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading Profile...</div>; // Add Skeleton Loader

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex items-center gap-6 p-6 border rounded-2xl bg-card/50">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 group-hover:border-primary transition-colors overflow-hidden">
            {userData?.avatar?.url ? (
              <Image 
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${userData.avatar.url}`} 
                unoptimized 
                alt="Avatar" 
                width={96} 
                height={96} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User size={40} className="text-primary/40" />
            )}
          </div>
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
          >
            <Camera size={14} className="text-white" />
          </label>
          <input 
            type="file"
            id="avatar-upload"
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <h4 className="font-medium">Profile Picture</h4>
          <p className="text-xs text-muted-foreground mt-1">Managed via Strapi Media Library.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Full Name */}
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <Input {...register("name")} id="name" className="pl-10" />
          </div>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div className="grid gap-2">
          <label htmlFor="phone">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <Input {...register("phone")} id="phone" className="pl-10" />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid gap-2">
          <label>Social Links</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input {...register("socialLinks.facebook")} placeholder="Facebook URL" />
            <Input {...register("socialLinks.twitter")} placeholder="Twitter URL" />
            <Input {...register("socialLinks.instagram")} placeholder="Instagram URL" />
            <Input {...register("socialLinks.linkedin")} placeholder="LinkedIn URL" />
          </div>
        </div>

        {/* Bio */}
        <div className="grid gap-2">
          <label htmlFor="bio">Short Bio</label>
          <Textarea {...register("bio")} id="bio" className="h-32 resize-none" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="px-8">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileSettingsForm;