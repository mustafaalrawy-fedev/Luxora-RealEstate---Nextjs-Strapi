"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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

interface StrapiItem {
  id: number;
  documentId: string;
  type_name?: string;
  amenity_name?: string;
  district_name?: string;
  // is_approved?: "pending" | "approved" | "rejected";
}

const EditPropertyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { slug: urlSlug } = useParams();

  const [loading, setLoading] = useState(false);

  // ── Image states ────────────────────────────────────────────────────────────
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  // Gallery Logic: Track what's already in Strapi vs what's new
  const [existingMedia, setExistingMedia] = useState<{ id: number; url: string }[]>([]);
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState<string[]>([]);
  const [mediaError, setMediaError] = useState<string>("");

  // ── Form setup ──────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
  });

  // ── 1. Fetch Existing Property Data ──────────────────────────────────────────
  const { data: property, isLoading: isFetching } = useQuery({
    queryKey: ["property-edit", urlSlug],
    queryFn: async () => {
      const res = await axiosInstance.get(`/properties?filters[slug][$eq]=${urlSlug}&populate=*`);
      return res.data.data[0];
    },
  });

  // ── 2. Populate Form (Hydration) ─────────────────────────────────────────────
  useEffect(() => {
    if (property) {
      reset({
        property_name: property.property_name,
        slug: property.slug,
        short_description: property.short_description,
        long_description: property.long_description,
        price: String(property.price),
        area_size_sqft: String(property.area_size_sqft),
        bedroom: String(property.bedroom),
        bathroom: String(property.bathroom),
        property_status: property.property_status,
        construction_status: property.construction_status,
        build_year: property.build_year ? property.build_year.split("-")[0] : "",
        developer: property.developer,
        district: property.district?.documentId,
        property_type: property.property_type?.documentId,
        amenities: property.amenities?.map((a: {documentId: string}) => a.documentId) || [],
        agent: property.agent?.documentId,
        is_approved: property.is_approved,
        availability_status: property.availability_status,
      });

      if (property.featured_image) setPreviewImage(`${process.env.NEXT_PUBLIC_STRAPI_URL}${property.featured_image.url}`);
      if (property.media) {
        setExistingMedia(property.media.map((m: {id: number, url: string}) => ({ id: m.id, url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${m.url}` })));
      }
    }
  }, [property, reset]);

  // ── 3. Image Handlers ───────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewMediaFiles((prev) => [...prev, ...files]);
    setNewMediaPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingGalleryItem = (id: number) => {
    setExistingMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const removeNewGalleryItem = (index: number) => {
    setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setNewMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── 4. Fetch Select Options (Districts, Types, Amenities) ────────────────────
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
    queryFn: async () => (await axiosInstance.get("/districts?populate[city][populate]=country&sort=district_name:asc")).data.data,
  });

  // ── 5. Submit (PUT Request) ─────────────────────────────────────────────────
  const onSubmit = async (data: PropertyValues) => {
    setLoading(true);
    const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:1337";

    try {
      // Step A: Upload New Featured Image if changed
      let featuredId = property.featured_image?.id;
      if (imageFile) {
        const formData = new FormData();
        formData.append("files", imageFile);
        const res = await fetch(`${STRAPI_BASE}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session?.user?.jwt}` },
          body: formData,
        });
        const uploaded = await res.json();
        featuredId = uploaded[0].id;
      }

      // Step B: Upload New Gallery Images
      let uploadedMediaIds: number[] = [];
      if (newMediaFiles.length > 0) {
        const mediaFormData = new FormData();
        newMediaFiles.forEach((file) => mediaFormData.append("files", file));
        const res = await fetch(`${STRAPI_BASE}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session?.user?.jwt}` },
          body: mediaFormData,
        });
        const uploaded = await res.json();
        uploadedMediaIds = uploaded.map((f: {id: number}) => f.id);
      }

      // Step C: Combine existing kept IDs + newly uploaded IDs
      const finalMediaIds = [...existingMedia.map((m) => m.id), ...uploadedMediaIds];

      // Step D: Send PUT request
      const response = await fetch(`${STRAPI_BASE}/api/properties/${property.documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user?.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ...data,
            price: Number(data.price),
            area_size_sqft: Number(data.area_size_sqft),
            bedroom: Number(data.bedroom),
            bathroom: Number(data.bathroom),
            build_year: data.build_year ? `${data.build_year}-01-01` : null,
            // Use 'set' for relations in v5
            district: { set: [data.district] },
            property_type: { set: [data.property_type] },
            amenities: { set: data.amenities },
            featured_image: featuredId,
            media: finalMediaIds,
            is_approved: data.is_approved,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update property");

      toast.success("Property updated successfully!");
      router.push("/agent/properties");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Property</h1>
          <p className="text-muted-foreground">Modify details for: {property?.property_name}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Featured Image */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Featured Image</label>
          <div className="group relative border-2 border-dashed border-muted-foreground/20 rounded-3xl p-4 bg-card/50">
            {previewImage ? (
              <div className="relative h-[350px] w-full rounded-2xl overflow-hidden">
                <Image src={previewImage} alt="Preview" fill unoptimized className="object-cover" />
                <Button 
                  type="button" variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full"
                  onClick={() => { setPreviewImage(null); setImageFile(null); }}
                >
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-[300px] cursor-pointer">
                <UploadCloud size={40} className="text-primary mb-2" />
                <p className="font-bold">Upload New Main Image</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
          {imageError && <p className="text-destructive text-sm">{imageError}</p>}
        </div>

        {/* Gallery */}
        <div className="space-y-4">
          <label className="text-sm font-semibold">Media Gallery</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Existing Images from DB */}
            {existingMedia.map((img) => (
              <div key={img.id} className="relative h-32 rounded-xl overflow-hidden border">
                <Image src={img.url} alt="Gallery" fill unoptimized className="object-cover" />
                <button type="button" onClick={() => removeExistingGalleryItem(img.id)} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"><X size={14} /></button>
              </div>
            ))}
            {/* Newly selected images */}
            {newMediaPreviews.map((url, index) => (
              <div key={index} className="relative h-32 rounded-xl overflow-hidden border border-primary">
                <Image src={url} alt="New" fill unoptimized className="object-cover" />
                <button type="button" onClick={() => removeNewGalleryItem(index)} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"><X size={14} /></button>
              </div>
            ))}
            <label className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-primary/5">
              <UploadCloud size={24} />
              <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
            </label>
          </div>
          {mediaError && <p className="text-destructive text-sm">{mediaError}</p>}
        </div>

        {/* ── Title & Slug ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Property Title</label>
            <Input {...register("property_name")} className="h-12" />
            {errors.property_name && <p className="text-xs text-destructive">{errors.property_name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Slug</label>
            <Input {...register("slug")} readOnly className="h-12 bg-muted/40 cursor-not-allowed" />
          </div>
        </div>

        {/* ── Status, Price, Area ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Listing Status</label>
            <Select value={watch("property_status")} onValueChange={(v) => setValue("property_status", v as "Sale" | "Rent")}>
              <SelectTrigger className="h-12 w-full" size="lg" ><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">For Sale</SelectItem>
                <SelectItem value="Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            {errors.property_status && <p className="text-destructive text-xs">{errors.property_status.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (EGP)</label>
            <Input type="number" {...register("price")} className="h-12" />
            {errors.price && <p className="text-destructive text-xs">{errors.price.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Area (sqft)</label>
            <Input type="number" {...register("area_size_sqft")} className="h-12" />
            {errors.area_size_sqft && <p className="text-destructive text-xs">{errors.area_size_sqft.message}</p>}
          </div>
        </div>

        {/* ── Availability Status ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Availability Status</label>
            <Select value={watch("availability_status")} onValueChange={(v) => setValue("availability_status", v as "Available" | "Sold" | "Rented" | "Off-plan")}>
              <SelectTrigger className="h-12 w-full" size="lg" ><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
                <SelectItem value="Rented">Rented</SelectItem>
                <SelectItem value="Off-plan">Off-plan</SelectItem>
              </SelectContent>
            </Select>
            {errors.availability_status && <p className="text-destructive text-xs">{errors.availability_status.message}</p>}
          </div>
        </div>

        {/* ── Descriptions ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Short Description</label>
            <Input {...register("short_description")} className="h-12" />
            {errors.short_description && <p className="text-destructive text-xs">{errors.short_description.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Detailed Description</label>
            <Textarea {...register("long_description")} className="min-h-[150px]" />
            {errors.long_description && <p className="text-destructive text-xs">{errors.long_description.message}</p>}
          </div>
        </div>

        {/* ── Type, Bedrooms, Bathrooms ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Property Type</label>
            <Select value={watch("property_type")} onValueChange={(v) => setValue("property_type", v)}>
              <SelectTrigger className="h-12 w-full" size="lg"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {propertyTypes?.map((t: StrapiItem) => (
                  <SelectItem key={t.documentId} value={t.documentId}>{t.type_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property_type && <p className="text-destructive text-xs">{errors.property_type.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Bedrooms</label>
            <Input type="number" {...register("bedroom")} className="h-12" />
            {errors.bedroom && <p className="text-destructive text-xs">{errors.bedroom.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Bathrooms</label>
            <Input type="number" {...register("bathroom")} className="h-12" />
            {errors.bathroom && <p className="text-destructive text-xs">{errors.bathroom.message}</p>}
          </div>
        </div>

        {/* ── Construction, Build Year, Developer ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Construction Status</label>
            <Select 
              value={watch("construction_status") ?? ""} 
              onValueChange={(v) => setValue("construction_status", v as "Finished" | "Under Construction")}
            >
              <SelectTrigger className="h-12 w-full" size="lg"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Finished">Finished</SelectItem>
                <SelectItem value="Under Construction">Under Construction</SelectItem>
              </SelectContent>
            </Select>
            {errors.construction_status && <p className="text-destructive text-xs">{errors.construction_status.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Build Year</label>
            <Input {...register("build_year")} className="h-12" maxLength={4} />
            {errors.build_year && <p className="text-destructive text-xs">{errors.build_year.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Developer Name</label>
            <Input {...register("developer")} className="h-12" />
            {errors.developer && <p className="text-destructive text-xs">{errors.developer.message}</p>}
          </div>
        </div>

        {/* ── District Selection ─────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">District</label>
          <Select value={watch("district")} onValueChange={(v) => setValue("district", v)}>
            <SelectTrigger className="h-12 w-full" size="lg"><SelectValue placeholder="Select District" /></SelectTrigger>
            <SelectContent>
              {districts?.map((d: StrapiItem) => (
                <SelectItem key={d.documentId} value={d.documentId}>{d.district_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.district && <p className="text-destructive text-xs">{errors.district.message}</p>}
        </div>

        {/* ── Amenities (Multi-Select) ─────────────────────────────────────────────────── */}
        <div className="border-t pt-8">
          <SearchableMultiSelect
            label="Amenities"
            options={amenities?.map((a: StrapiItem) => ({ id: a.documentId, name: a.amenity_name })) || []}
            selectedValues={watch("amenities") || []}
            onChange={(vals) => setValue("amenities", vals.map(String))}
            error={errors.amenities?.message}
          />
          {errors.amenities && <p className="text-destructive text-xs">{errors.amenities.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full md:w-fit px-10 shadow-xl">
          {loading ? <><Loader2 className="animate-spin mr-2" /> Saving Changes...</> : "Update Property"}
        </Button>
      </form>
    </section>
  );
};

export default EditPropertyPage;