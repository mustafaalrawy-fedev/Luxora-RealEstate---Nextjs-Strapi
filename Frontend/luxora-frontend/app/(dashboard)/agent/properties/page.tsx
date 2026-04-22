"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Edit, Trash2, Plus, Home, Info } from "lucide-react";

// Components & UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PropertyPagination from "@/components/properties/PropertyPagination";
import DeletePropertyModal from "@/components/dashboard/shared/DeletePropertyModal";
import AvailabilityStatusToggle from "@/components/dashboard/stats/AvailabilityStatusToggle";
import PropertyFilter from "@/components/properties/PropertyFilter";

// Hooks & Utils
import PropertyDetails from "@/types/property";
import { formatCurrency, cn } from "@/lib/utils";
import { useAgentProperties } from "@/hooks/use-agent-properties";
import usePropertyAvailableStatusUpdate from "@/hooks/use-property-avaliable-status-update";

// Motion Variants
import { containerVariants, itemVariants } from "@/components/motion";
import { AgentPropertiesSkeleton } from "@/components/shared/LoadingState";

const AgentPropertiesPage = () => {
  const [open, setOpen] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const { 
    properties, 
    isLoading, 
    totalPages, 
    currentPage, 
    handlePageChange 
  } = useAgentProperties({ filter: true });

  const { updateStatus, isPending } = usePropertyAvailableStatusUpdate();

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground">Manage and track all your listed properties</p>
        </div>
        <Button asChild className="gap-2 shadow-md hover:shadow-lg transition-all active:scale-95">
          <Link href="/agent/properties/add-property">
            <Plus size={18} /> Add Property
          </Link>
        </Button>
      </motion.div>

      {/* Stats Quick View */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-card p-6 rounded-2xl border flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><Home size={24}/></div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Listings</p>
            <h3 className="text-2xl font-bold">{properties?.length}</h3>
          </div>
        </div>
      </motion.div>

      <div className="w-full">
        <PropertyFilter status={true} type={true} price={false} location={true} rooms={false}/>
      </div>

      {/* Properties List */}
      {isLoading ? (
        <AgentPropertiesSkeleton count={5} />
      ) : (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {properties?.length > 0 ? (
            properties.map((property: PropertyDetails) => (
              <motion.div
                key={property.id}
                layout
                variants={itemVariants}
                className={cn(
                  "group bg-card border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow", 
                  property.is_approved === "pending" ? "border-warning/25 bg-warning/5" : 
                  property.is_approved === "approved" ? "border-success/25 bg-success/5" : 
                  "border-destructive/25 bg-destructive/5"
                )}
              >
                {/* Image Thumbnail */}
                <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden bg-muted group-hover:ring-2 ring-primary/20 transition-all">
                  {property.featured_image?.url ? (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${property.featured_image.url}`} 
                      alt={property.property_name ?? "Property"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-secondary/20 text-muted-foreground"><Home /></div>
                  )}
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <h3 className="font-bold text-lg leading-tight">{property.property_name}</h3>
                    <Badge variant={property.property_status === 'Sale' ? 'default' : 'secondary'} className="rounded-full px-3">
                      {property.property_status}
                    </Badge>
                    
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "rounded-full",
                        property.is_approved === "approved" && "bg-success/20 text-success border-success/80",
                        property.is_approved === "pending" && "bg-warning/20 text-warning border-warning/80",
                        property.is_approved === "rejected" && "bg-destructive/20 text-destructive border-destructive/80"
                      )}
                    >
                      {property.is_approved}
                    </Badge>

                    {property.is_approved === "rejected" && (
                      <Tooltip>
                        <TooltipTrigger asChild> 
                          <Info size={16} className="text-destructive animate-pulse cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px] bg-destructive text-destructive-foreground">
                          <p className="text-xs">{property.rejected_message}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-1 italic">{property.short_description}</p>
                  <p className={cn("font-bold text-lg text-primary", property.property_status === 'Rent' && 'text-secondary')}>
                    {formatCurrency(property.price)}
                  </p>
                  
                  {property.is_approved === "approved" && (
                    <div className="mt-2 flex justify-center md:justify-start">
                      <AvailabilityStatusToggle 
                        property={property} 
                        isUpdating={isPending} 
                        onUpdate={(documentId, status) => updateStatus({documentId, newStatus: status})} 
                      />
                    </div>
                  )}
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl md:bg-transparent">
                  <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors">
                    <Link href={`/agent/properties/${property.slug}/edit-property`}>
                      <Edit size={18} />
                    </Link>
                  </Button>
                  
                  <Button 
                    onClick={() => {setOpen(true); setPropertyId(property.documentId)}} 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </Button>
                  
                  <Button variant="outline" asChild className="rounded-full text-xs font-semibold shadow-sm border-2 hover:border-foreground transition-all">
                     <Link href={`/properties/${property.slug}`}>View</Link>
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              key="empty-state"
              variants={itemVariants}
              className="text-center py-20 border-2 border-dashed border-muted-foreground/20 rounded-3xl bg-muted/5"
            >
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="text-muted-foreground/50" size={32} />
              </div>
              <p className="text-muted-foreground font-medium">You haven&apos;t added any properties yet.</p>
              <Button variant="link" asChild className="text-primary font-bold">
                <Link href="/agent/properties/add-property">Start adding now</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      )}

      {/* Delete Modal */}
      {open && (
        <DeletePropertyModal open={open} setOpen={setOpen} propertyId={propertyId} />
      )}

      {/* Pagination */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <PropertyPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          handlePageChange={handlePageChange} 
          className="justify-end pt-4" 
        />
      </motion.div>
    </section>
  );
}

export default AgentPropertiesPage;