"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { propertySchema, PropertyValues } from "@/lib/validations/add-property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UploadCloud, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { SearchableMultiSelect } from "@/components/shared/multi-select-search";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StrapiItem {
  id: string;
  type_name?: string;
  amenity_name?: string;
  // city_name?: string;
  // country_name?: string;
  district_name?: string
}

interface UploadedFile {
  id: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
const AddPropertyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ── Image states (managed outside RHF intentionally) ───────────────────────
  const [previewImage, setPreviewImage]       = useState<string | null>(null);
  const [imageFile, setImageFile]             = useState<File | null>(null);
  const [imageError, setImageError]           = useState<string>("");
  const [mediaFiles, setMediaFiles]       = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [mediaError, setMediaError]       = useState<string>("");

  // ── Form setup ─────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      property_status: "Sale",
      amenities: [],
      agent: "", 
      build_year: "",
      developer: "",
      district: "", 
    },
  });

  // ── Auto-set agent ID from session ─────────────────────────────────────────
  // This is the KEY fix — agent was required in schema but never populated,
  // causing silent Zod validation failure that blocked onSubmit from running.
  useEffect(() => {
    if (session?.user?.id) {
      setValue("agent", String(session.user.id), { shouldValidate: true });
    }
  }, [session?.user?.id, setValue]);

  // ── Auto-generate slug ──────────────────────────────────────────────────────
  const propertyName = watch("property_name");
  useEffect(() => {
    if (propertyName) {
      const slug = propertyName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [propertyName, setValue]);

  // ── Featured image ──────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageError("");
    setPreviewImage(URL.createObjectURL(file));
  };

  // ── Gallery ────────────────────────────────────────────────────────────────
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setMediaFiles((prev) => [...prev, ...files]);
    setMediaPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setMediaError("");
  };

  const removeGalleryImage = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Remote data ─────────────────────────────────────────────────────────────
  const { data: propertyTypes } = useQuery({
    queryKey: ["property-types"],
    queryFn: async () => (await axiosInstance.get("/property-types")).data.data,
  });

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: async () => (await axiosInstance.get("/amenities")).data.data,
  });

  const { data: districts } = useQuery({
  queryKey: ["districts"],
  queryFn: async () => {
    // Fetches District -> City -> Country
    const res = await axiosInstance.get("/districts?populate[city][populate]=country");
    return res.data.data;
  },
});


  // ── Submit ──────────────────────────────────────────────────────────────────
const onSubmit = async (data: PropertyValues) => {
  let valid = true;
  if (!imageFile) { setImageError("Featured image is required"); valid = false; }
  if (mediaFiles.length < 4) { setMediaError("Please upload at least 4 gallery images"); valid = false; }
  if (!valid) return;

  // Use the base URL without /api for upload (Strapi upload endpoint is at root)
  const STRAPI_BASE = (process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api")
    .replace(/\/api\/?$/, ""); // strips trailing /api → "http://localhost:1337"

  const STRAPI_API = `${STRAPI_BASE}/api`;

  setLoading(true);
  try {
    // ── 1. Upload featured image via fetch (bypasses axiosInstance headers) ──
    const featuredFormData = new FormData();
    featuredFormData.append("files", imageFile!);

    const featuredUploadRes = await fetch(`${STRAPI_BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.user?.jwt}` },
      // ✅ No Content-Type — browser sets multipart/form-data + boundary
      body: featuredFormData,
    });

    if (!featuredUploadRes.ok) {
      const err = await featuredUploadRes.json();
      console.error("Featured upload error:", err);
      throw new Error(err?.error?.message ?? `Featured image upload failed (${featuredUploadRes.status})`);
    }

    const featuredUploaded = await featuredUploadRes.json();
    const featuredId: number = featuredUploaded[0]?.id;
    console.log("✅ Featured uploaded, id:", featuredId); // temp

    // ── 2. Upload gallery via fetch ────────────────────────────────────────
    const mediaFormData = new FormData();
    mediaFiles.forEach((file) => mediaFormData.append("files", file));

    const mediaUploadRes = await fetch(`${STRAPI_BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.user?.jwt}` },
      body: mediaFormData,
    });

    if (!mediaUploadRes.ok) {
      const err = await mediaUploadRes.json();
      console.error("Media upload error:", err);
      throw new Error(err?.error?.message ?? `Media upload failed (${mediaUploadRes.status})`);
    }

    const mediaUploaded = await mediaUploadRes.json();
    const mediaIds: number[] = mediaUploaded.map((f: UploadedFile) => f.id);
    console.log("✅ Media uploaded, ids:", mediaIds);

    // ── 3. Create property ─────────────────────────────────────────────────
    const propertyRes = await fetch(`${STRAPI_API}/properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          property_name:       data.property_name,
          slug:                data.slug,
          short_description:   data.short_description,
          long_description:    data.long_description,
          price:               Number(data.price),
          area_size_sqft:      Number(data.area_size_sqft),
          bedroom:             Number(data.bedroom),
          bathroom:            Number(data.bathroom),
          property_status:     data.property_status,
          construction_status: data.construction_status,
          build_year:          data.build_year,
          developer:           data.developer,
          district:            Number(data.district),
          property_type:       Number(data.property_type),
          amenities:           (data.amenities ?? []).map(Number),
          agent:               Number(data.agent),
          featured_image:      featuredId,
          media:               mediaIds,
        },
      }),
    });

    const propertyJson = await propertyRes.json();
    console.log("Property response:", propertyJson); // shows exact Strapi error if 400

    if (!propertyRes.ok) {
      throw new Error(propertyJson?.error?.message ?? `Property creation failed (${propertyRes.status})`);
    }

    toast.success("Property published successfully!");
    router.push("/agent/properties");
    router.refresh();

  } catch (error) {
    console.error("Submit error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to publish property");
  } finally {
    setLoading(false);
  }
};

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="max-w-5xl mx-auto py-10 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add Property</h1>
          <p className="text-muted-foreground">Fill in the details to list your property</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 animate-in fade-in duration-700">

        {/*
          Hidden inputs are REQUIRED for Select-driven fields.
          Without register(), RHF won't include them in handleSubmit(data) — 
          and Zod will fail validation silently, blocking submit entirely.
        */}
        <input type="hidden" {...register("property_type")} />
        {/* <input type="hidden" {...register("country")} /> */}
        {/* <input type="hidden" {...register("city")} /> */}
        <input type="hidden" {...register("agent")} />

        {/* ── Featured Image ─────────────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Featured Image</label>
          <div className="group relative border-2 border-dashed border-muted-foreground/20 rounded-3xl p-4 transition-all hover:border-primary/50 bg-card/50">
            {previewImage ? (
              <div className="relative h-[350px] w-full rounded-2xl overflow-hidden">
                <Image src={previewImage} alt="Preview" fill unoptimized className="object-cover" />
                <Button
                  type="button" variant="destructive" size="icon"
                  className="absolute top-4 right-4 rounded-full"
                  onClick={() => { setPreviewImage(null); setImageFile(null); }}
                >
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-[300px] cursor-pointer">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={40} />
                </div>
                <p className="font-bold text-lg">Upload Main Image</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
          {imageError && <p className="text-xs text-destructive font-medium">{imageError}</p>}
        </div>

        {/* ── Media ──────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <label className="text-sm font-semibold flex justify-between">
            Media Images
            <span className="text-xs font-normal text-muted-foreground">
              Min 4 required ({mediaFiles.length} added)
            </span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaPreviews.map((url, index) => (
              <div key={url} className="relative h-32 rounded-xl overflow-hidden border">
                <Image src={url} alt={`Gallery ${index + 1}`} fill unoptimized className="object-cover" />
                <button
                  type="button" onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-primary/5 border-muted-foreground/20 transition-colors">
              <UploadCloud size={24} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Add photos</span>
              <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
            </label>
          </div>
          {mediaError && <p className="text-xs text-destructive font-medium">{mediaError}</p>}
        </div>

        {/* ── Title & Slug ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Property Title</label>
            <Input {...register("property_name")} placeholder="Modern Apartment in Maadi" className="h-12" />
            {errors.property_name && <p className="text-xs text-destructive">{errors.property_name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Slug (Auto-generated)</label>
            <Input {...register("slug")} readOnly className="h-12 text-muted-foreground cursor-not-allowed bg-muted/40" />
            <p className="text-xs text-muted-foreground">Generated automatically from the title</p>
          </div>
        </div>

        {/* ── Status, Price, Area ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Listing Status</label>
            <Select
              onValueChange={(v) => setValue("property_status", v as "Sale" | "Rent")}
              defaultValue="Sale"
            >
              <SelectTrigger className="h-12 w-full" size="lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">For Sale</SelectItem>
                <SelectItem value="Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            {errors.property_status && <p className="text-xs text-destructive">{errors.property_status.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (EGP)</label>
            <Input type="number" min={0} {...register("price")} className="h-12" placeholder="0" />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Area (sqft)</label>
            <Input type="number" min={0} {...register("area_size_sqft")} className="h-12" placeholder="0" />
            {errors.area_size_sqft && <p className="text-xs text-destructive">{errors.area_size_sqft.message}</p>}
          </div>
        </div>

        {/* ── Descriptions ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Short Description</label>
            <Input {...register("short_description")} className="h-12" placeholder="Brief summary of the property" />
            {errors.short_description && <p className="text-xs text-destructive">{errors.short_description.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Detailed Description</label>
            <Textarea {...register("long_description")} className="min-h-[150px]" placeholder="Describe the property in detail..." />
            {errors.long_description && <p className="text-xs text-destructive">{errors.long_description.message}</p>}
          </div>
        </div>

        {/* ── Property Type, Bedrooms, Bathrooms ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Property Type</label>
            <Select onValueChange={(v) => setValue("property_type", v, { shouldValidate: true })}>
              <SelectTrigger className="h-12 w-full" size="lg"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {propertyTypes?.map((t: StrapiItem) => (
                  <SelectItem key={t.id} value={t.id.toString()}>{t.type_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property_type && <p className="text-xs text-destructive">{errors.property_type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Bedrooms</label>
            <Input type="number" min={0} {...register("bedroom")} className="h-12" placeholder="0" />
            {errors.bedroom && <p className="text-xs text-destructive">{errors.bedroom.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Bathrooms</label>
            <Input type="number" min={0} {...register("bathroom")} className="h-12" placeholder="0" />
            {errors.bathroom && <p className="text-xs text-destructive">{errors.bathroom.message}</p>}
          </div>
        </div>

        {/* ── Construction Status, Build Year, Developer ───────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Construction Status</label>
            <Select
              onValueChange={(v) =>
                setValue("construction_status", v as "Finished" | "Under Construction", { shouldValidate: true })
              }
            >
              <SelectTrigger className="h-12 w-full" size="lg"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Finished">Finished</SelectItem>
                <SelectItem value="Under Construction">Under Construction</SelectItem>
              </SelectContent>
            </Select>
            {errors.construction_status && <p className="text-xs text-destructive">{errors.construction_status.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Build Year</label>
            <Input
              {...register("build_year")}
              className="h-12"
              placeholder="e.g. 2023"
              maxLength={4}
            />
            {errors.build_year && <p className="text-xs text-destructive">{errors.build_year.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Developer Name</label>
            <Input
              {...register("developer")}
              className="h-12"
              placeholder="e.g. Palm Hills Developments"
            />
            {errors.developer && <p className="text-xs text-destructive">{errors.developer.message}</p>}
          </div>
        </div>

        {/* ── Location ─────────────────────────────────────────────────────── */}
          {/* ── District ────────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">District</label>
            <Select onValueChange={(v) => setValue("district", v, { shouldValidate: true })}>
              <SelectTrigger className="h-12 w-full" size="lg"><SelectValue placeholder="Select District" /></SelectTrigger>
              <SelectContent>
                {districts?.map((d: StrapiItem) => (
                  <SelectItem key={d.id} value={d.id.toString()}>{d.district_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
          </div>

        {/* ── Amenities ────────────────────────────────────────────────────── */}
        <div className="border-t pt-8">
          <SearchableMultiSelect
            label="Amenities"
            options={amenities?.map((a: StrapiItem) => ({ id: a.id, name: a.amenity_name })) || []}
            selectedValues={watch("amenities") || []}
            // onChange={(vals) => setValue("amenities", vals, { shouldValidate: true })}
            onChange={(vals) => setValue("amenities", vals.map(String), { shouldValidate: true })}
            error={errors.amenities?.message}
          />
        </div>

        {/* ── Submit ───────────────────────────────────────────────────────── */}
        <Button type="submit" disabled={loading} className="w-full md:w-fit px-10 shadow-xl">
          {loading ? (
            <><Loader2 className="animate-spin mr-2" /> Processing...</>
          ) : (
            "List Property Now"
          )}
        </Button>
      </form>
    </section>
  );
};

export default AddPropertyPage;