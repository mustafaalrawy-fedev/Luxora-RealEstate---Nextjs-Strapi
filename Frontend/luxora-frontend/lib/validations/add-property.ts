import * as z from "zod";

export const propertySchema = z.object({
  property_name: z.string().min(5, "Name must be at least 5 characters"),
  short_description: z.string().min(10, "Short description is required"),
  long_description: z.string().min(20, "Long description is required"),
  price: z.string().min(1, "Price is required"),
  area_size_sqft: z.string().min(1, "Area size is required"),
  bedroom: z.string().min(1),
  bathroom: z.string().min(1),
  property_status: z.enum(["Sale", "Rent"]).optional(),
  property_type: z.enum(["Apartment", "House", "Villa", "Commercial"]).optional(), // 
  district: z.string().min(1, "Please select a district"),
  city: z.string().min(1, "Please select a city"),
  country: z.string().min(1, "Please select a country"),
  agent: z.string().min(1, "Please select an agent"),
  developer: z.string().min(1, "Please select a developer"),
  amenities: z.array(z.string()).min(1, "Please select at least one amenity"),
  media: z.array(z.string()).min(1, "Please select at least one image"),
  featured_image: z.string().min(1, "Please select a featured image"),  
  slug: z.string().min(1, "Please select a slug"),
    construction_status: z.enum(["Finished", "Under Construction"]).optional(),
    build_year: z.string().min(1, "Build year is required"),
  
});

export type PropertyValues = z.infer<typeof propertySchema>;