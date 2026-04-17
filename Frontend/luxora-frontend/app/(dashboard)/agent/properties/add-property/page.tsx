"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { propertySchema, PropertyValues } from "@/lib/validations/add-property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UploadCloud, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

const AddPropertyPage = () => {

  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: { property_status: "Sale" }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // TODO: Add property to Strapi
  const onSubmit = async (data: PropertyValues) => {
    if (!imageFile) return toast.error("Please upload a featured image");
    
    setLoading(true);
    try {
      // 1. رفع الصورة إلى Strapi
      const formData = new FormData();
      formData.append("files", imageFile);
      
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.jwt}` },
        body: formData,
      });
      const uploadedFiles = await uploadRes.json();
      const imageId = uploadedFiles[0].id;

      // 2. إرسال بيانات العقار وربطها بالصورة والوكيل
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/properties`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.user?.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ...data,
            price: Number(data.price),
            area_size_sqft: Number(data.area_size_sqft),
            bedroom: Number(data.bedroom),
            bathroom: Number(data.bathroom),
            featured_image: imageId,
            agent: session?.user?.id,
            // إنشاء Slug تلقائي بسيط
            slug: data.property_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
          },
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Property published successfully!");
      router.push("/agent/properties");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

// Fetch property types from strapi
const {data: propertyTypes} = useQuery({
  queryKey: ["property-types"],
  queryFn: async () => {
    const res = await axiosInstance.get("/property-types");
    return res.data.data;
  },
})

// Fetch cities from strapi
const {data: cities} = useQuery({
  queryKey: ["cities"],
  queryFn: async () => {
    const res = await axiosInstance.get("/cities");
    return res.data.data;
  },
})

// Fetch countries from strapi
const {data: countries} = useQuery({
  queryKey: ["countries"],
  queryFn: async () => {
    const res = await axiosInstance.get("/countries");
    return res.data.data;
  },
})

// console.log({propertyTypes, cities, countries})

  return (
    <section>
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add Property</h1>
          <p className="text-muted-foreground">Add a new property to the marketplace</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
        {/* Image Upload Area */}
        <div className="group relative border-2 border-dashed border-muted-foreground/20 rounded-3xl p-4 transition-all hover:border-primary/50 bg-card/50">
          {previewImage ? (
            <div className="relative h-[300px] w-full rounded-2xl overflow-hidden">
              <Image src={previewImage} alt="Preview" fill className="object-cover" />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
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
              <p className="font-bold text-lg">Upload Featured Image</p>
              <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
          {errors.featured_image && <p className="text-xs text-destructive">{errors.featured_image.message}</p>}
        </div>

        {/* Add Gallery min 4 images */}

        {/* Property Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Property Title</label>
            <Input {...register("property_name")} placeholder="e.g. Luxury Villa with Sea View" className="h-12" />
            {errors.property_name && <p className="text-xs text-destructive">{errors.property_name.message}</p>}
          </div>

          {/* Property Status */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Property Status</label>
            <Select onValueChange={(v) => setValue("property_status", v as "Sale" | "Rent")} {...register("property_status")} defaultValue="Sale">
              <SelectTrigger className="h-12 w-full" size="lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">For Sale</SelectItem>
                <SelectItem value="Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            {errors.property_status && <p className="text-xs text-destructive">{errors.property_status.message}</p>}
          </div>

          {/* Price (EGP) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (EGP)</label>
            <Input type="number" {...register("price")} placeholder="0.00" className="h-12" />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>

          {/* Total Area (sqft) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Total Area (sqft)</label>
            <Input type="number" {...register("area_size_sqft")} placeholder="e.g. 2500" className="h-12" />
            {errors.area_size_sqft && <p className="text-xs text-destructive">{errors.area_size_sqft.message}</p>}
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Short Description</label>
          <Input {...register("short_description")} placeholder="Brief catchphrase for the property" className="h-12" />
          {errors.short_description && <p className="text-xs text-destructive">{errors.short_description.message}</p>}
        </div>

      {/* Long Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Long Description</label>
        <Textarea {...register("long_description")} placeholder="Describe all details..." className="min-h-[150px] resize-none" />
        {errors.long_description && <p className="text-xs text-destructive">{errors.long_description.message}</p>}
      </div>

      {/* Property Type */}
      {/* سيتم استبدال هذه بـ Select لاحقاً لجلب البيانات من API */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Type ID</label>
        <Select>
          <SelectTrigger className="h-12 w-full" size="lg">
              <SelectValue placeholder="Select type" {...register("property_type")} />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes?.map((type: {id: number, type_name: string}) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.type_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.property_type && <p className="text-xs text-destructive">{errors.property_type.message}</p>}
        </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Bedrooms */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Bedrooms</label>
          <Input type="number" {...register("bedroom")} className="h-12" />
          {errors.bedroom && <p className="text-xs text-destructive">{errors.bedroom.message}</p>}
        </div>
        {/* Bathrooms */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Bathrooms</label>
          <Input type="number" {...register("bathroom")} className="h-12" />
          {errors.bathroom && <p className="text-xs text-destructive">{errors.bathroom.message}</p>}
        </div>
      </div>

      {/* Location */}
      {/* District */}
        {/* سيتم استبدال هذه بـ Select لاحقاً لجلب البيانات من API */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">District ID</label>
          <Input {...register("district")} placeholder="1" className="h-12" />
          {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Country */}
        {/* سيتم استبدال هذه بـ Select لاحقاً لجلب البيانات من API */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Country ID</label>
          <Select>
            <SelectTrigger className="h-12 w-full" size="lg">
              <SelectValue placeholder="Select country" {...register("country")} />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((country: {id: number, country_name: string}) => (
                <SelectItem key={country.id} value={country.id.toString()}>
                  {country.country_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>

        {/* City */}
        {/* سيتم استبدال هذه بـ Select لاحقاً لجلب البيانات من API */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">City ID</label>
          <Select>
            <SelectTrigger className="h-12 w-full" size="lg">
              <SelectValue placeholder="Select city" {...register("city")} />
            </SelectTrigger>
            <SelectContent>
              {cities?.map((city: {id: number, city_name: string}) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-fit text-sm font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" /> Publishing...
          </>
        ) : (
          "List Property Now"
        )}
      </Button>
    </form>
    </section>
  );
};

export default AddPropertyPage;