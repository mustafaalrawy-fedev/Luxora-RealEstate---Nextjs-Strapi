import * as z from "zod";

export const propertySchema = z.object({
  // ── Core Info ──────────────────────────────────────────────────────────────
  property_name:     z.string().min(5, "Name must be at least 5 characters"),
  slug:              z.string().min(1, "Slug is required"),
  short_description: z.string().min(10, "Short description must be at least 10 characters"),
  long_description:  z.string().min(20, "Long description must be at least 20 characters"),

  // ── Pricing & Size ─────────────────────────────────────────────────────────
  price:         z.string().min(1, "Price is required"),
  area_size_sqft: z.string().min(1, "Area size is required"),
  bedroom:       z.string().min(1, "Bedrooms is required"),
  bathroom:      z.string().min(1, "Bathrooms is required"),

  // ── Classification ─────────────────────────────────────────────────────────
  property_status:      z.enum(["Sale", "Rent"]).default("Sale"),
  property_type:        z.string().min(1, "Please select a property type"),
  construction_status:  z.enum(["Finished", "Under Construction"]).optional(),
  build_year:           z.string().min(4, "Build year is required"),

  // ── Location ───────────────────────────────────────────────────────────────
  district: z.string().min(1, "District is required"),
  // city:     z.string().min(1, "Please select a city"),
  // country:  z.string().min(1, "Please select a country"),

  // ── Relations & Extra ──────────────────────────────────────────────────────
  developer: z.string().min(1, "Developer name is required"),
  // amenities: z.array(z.string()).min(1, "Please select at least one amenity"),
  amenities: z.array(z.union([z.string(), z.number()])).optional().default([]),

  // ── Agent (set from session, hidden field) ─────────────────────────────────
  // We keep it in the schema so it's included in the submitted data,
  // but we set it automatically from the session — user never types it.
  agent: z.string().min(1, "Agent is required"),

  // NOTE: featured_image, gallery, and media are managed as File state
  // outside of RHF and are handled separately in onSubmit — they are
  // intentionally NOT in this schema to avoid silent validation failures.
  
  is_approved: z.enum(["pending", "approved", "rejected"]).default("pending"),
  // is_approved_copy: z.boolean().optional().default(false),
});

export type PropertyValues = z.infer<typeof propertySchema>;