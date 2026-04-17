"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, Camera } from "lucide-react";
import { profileSchema, ProfileValues } from "@/lib/validations/profile-settings";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/use-profile";

const ProfileSettingsForm = () => {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const { data: userData, isLoading } = useProfile();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
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

  // Watch avatar to drive the preview (holds either a full URL or a base64 string)
  const currentAvatar = watch("avatar");

  // ── Sync Strapi data into the form once loaded ──────────────────────────────
  useEffect(() => {
    if (!userData) return;

    reset({
      name: userData.username ?? "",
      email: userData.email ?? "",
      phone: userData.phone ?? "",
      // Support both plain-text bio and Strapi Blocks format
      bio:
        typeof userData.bio === "string"
          ? userData.bio
          : userData.bio?.[0]?.children?.[0]?.text ?? "",
      socialLinks: {
        facebook:  userData.social_links?.facebook  ?? "",
        twitter:   userData.social_links?.twitter   ?? "",
        instagram: userData.social_links?.instagram ?? "",
        linkedin:  userData.social_links?.Linkedin  ?? "", // capital L in Strapi
      },
      // Store the full URL so <Image> can use it directly
      avatar: userData.avatar?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${userData.avatar.url}`
        : "",
    });
  }, [userData, reset]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<ProfileValues> = async (data) => {
    try {
      let avatarId: number | undefined = userData?.avatar?.id;

      // 1. Upload new avatar only when the user picked a new file (base64)
      if (data.avatar?.startsWith("data:image")) {
        const blob = await fetch(data.avatar).then((r) => r.blob());
        const formData = new FormData();
        formData.append("files", blob, "avatar.png");

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
          {
            method: "POST",   // ← was wrongly PUT before
            headers: { Authorization: `Bearer ${session?.user?.jwt}` },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        avatarId = uploadData[0]?.id;
      }

      // 2. Update user profile
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${session?.user?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.user?.jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.name,
            phone: data.phone,
            bio: data.bio,
            social_links: {
              facebook:  data.socialLinks.facebook,
              twitter:   data.socialLinks.twitter,
              instagram: data.socialLinks.instagram,
              Linkedin:  data.socialLinks.linkedin, // capital L
            },
            ...(avatarId !== undefined && { avatar: avatarId }),
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message ?? "Update failed");
      }

      const updatedUser = await res.json();

      // 3. Refresh NextAuth session name
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      });

      // 4. Invalidate the profile query so useProfile re-fetches fresh data
      queryClient.invalidateQueries({ queryKey: ["user", session?.user?.id] });

      // 5. If a new avatar was uploaded, update the avatar preview in the form
      if (updatedUser.avatar?.url) {
        setValue(
          "avatar",
          `${process.env.NEXT_PUBLIC_STRAPI_URL}${updatedUser.avatar.url}`
        );
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  // ── Image picker ─────────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Storing base64 lets onSubmit detect that a NEW image was chosen
      setValue("avatar", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse">Loading profile…</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* ── Avatar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 p-6 border rounded-2xl bg-card/50">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border flex items-center justify-center bg-muted">
            {currentAvatar ? (
              <Image
                // ✅ currentAvatar already holds the full URL or base64 — no concatenation needed
                src={currentAvatar}
                alt="Avatar preview"
                unoptimized
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={40} className="text-muted-foreground" />
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
          <p className="text-xs text-muted-foreground mt-1">
            Max size: 2 MB. JPG, PNG or WEBP.
          </p>
        </div>
      </div>

      <div className="grid gap-6">

        {/* ── Full Name ──────────────────────────────────────────────────────── */}
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <Input {...register("name")} id="name" className="pl-10" />
          </div>
          {errors.name && (
            <p className="text-xs text-error">{errors.name.message}</p>
          )}
        </div>

        {/* ── Phone ─────────────────────────────────────────────────────────── */}
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <Input
              {...register("phone")}
              id="phone"
              placeholder="+20 123 456 789"
              className={`pl-10 ${errors.phone ? "border-error" : ""}`}
            />
          </div>
          {/* ✅ error and helper text are OUTSIDE the relative div */}
          {errors.phone && (
            <p className="text-xs text-error font-medium">{errors.phone.message}</p>
          )}
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-primary">Note:</span> Used for
            property inquiries. A{" "}
            <span className="text-success font-medium">WhatsApp</span>-enabled
            number is recommended.
          </p>
          {errors.phone && (
            <p className="text-xs text-error font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* ── Social Links ───────────────────────────────────────────────────── */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Social Links</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook */}
            <div>
              <Input {...register("socialLinks.facebook")}  placeholder="Facebook URL" />
              {errors.socialLinks?.facebook && (
                <p className="text-xs text-error font-medium">{errors.socialLinks.facebook.message}</p>
              )}
            </div>
            {/* Twitter */}
            <div>
              <Input {...register("socialLinks.twitter")}   placeholder="Twitter URL" />
              {errors.socialLinks?.twitter && (
                <p className="text-xs text-error font-medium">{errors.socialLinks.twitter.message}</p>
              )}
            </div>
            {/* Instagram */}
            <div>
              <Input {...register("socialLinks.instagram")} placeholder="Instagram URL" />
              {errors.socialLinks?.instagram && (
                <p className="text-xs text-error font-medium">{errors.socialLinks.instagram.message}</p>
              )}
            </div>
            {/* LinkedIn */}
            <div>
              <Input {...register("socialLinks.linkedin")}  placeholder="LinkedIn URL" />
              {errors.socialLinks?.linkedin && (
                <p className="text-xs text-error font-medium">{errors.socialLinks.linkedin.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Bio ────────────────────────────────────────────────────────────── */}
        <div className="grid gap-2">
          <label htmlFor="bio" className="text-sm font-medium">Short Bio</label>
          <Textarea
            {...register("bio")}
            id="bio"
            className="h-32 resize-none"
            placeholder="Tell buyers a little about yourself…"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="px-8">
        {isSubmitting ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileSettingsForm;