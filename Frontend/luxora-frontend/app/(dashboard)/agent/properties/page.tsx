"use client"

import PropertyDetails from "@/types/property";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Home } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import PropertyPagination from "@/components/properties/PropertyPagination";
import qs from "qs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const AgentPropertiesPage = () => {

  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1)
  const page = searchParams.get('page') || currentPage
  const pageSize = 5

  const {data: session} = useSession();
  const profile = session?.user;

  const query = qs.stringify({
    populate: "*",
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
    filters: {
      agent: {
        id: profile?.id,
      },
    },
    sort: 'createdAt:desc',
  }, {encodeValuesOnly: true})

  const {data, isLoading} = useQuery({
    queryKey: ["agent-properties", page, profile?.id],
    queryFn: async() => {
        const res = await axiosInstance.get(`/properties?${query}`) // All properties
        return res.data
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    })

    const properties = data?.data
    const meta = data?.meta?.pagination
    const totalPages = meta?.pageCount || 1

    const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Smooth scroll to the top of the properties grid
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  if (isLoading) return <div className="p-10 text-center">Loading your properties...</div>;

  console.log({properties});

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">Manage and track all your listed properties</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/agent/properties/add-property">
            <Plus size={18} /> Add Property
          </Link>
        </Button>
      </div>

      {/* Stats Quick View (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><Home size={24}/></div>
          <div>
            <p className="text-sm text-muted-foreground">Total Listings</p>
            <h3 className="text-2xl font-bold">{properties.length}</h3>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="grid grid-cols-1 gap-4">
        {properties.length > 0 ? (
          properties.map((property: PropertyDetails) => (
            <div 
              key={property.id} 
              className="group bg-card border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-all"
            >
              {/* Image Thumbnail */}
              <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden bg-muted">
                {property.featured_image?.url ? (
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${property.featured_image.url}`} 
                    alt={property.property_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full"><Home className="text-muted-foreground" /></div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="font-bold text-lg">{property.property_name}</h3>
                  <Badge variant={property.property_status === 'Sale' ? 'default' : 'secondary'}>
                    {property.property_status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{property.short_description}</p>
                <p className={cn("font-bold text-primary", property.property_status === 'Rent' && 'text-secondary')}>{formatCurrency(property.price)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/agent/properties/edit/${property.id}`}>
                    <Edit size={16} />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                  <Trash2 size={16} />
                </Button>
                <Button variant="outline" asChild>
                   <Link href={`/properties/${property.slug}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <p className="text-muted-foreground">You haven&apos;t added any properties yet.</p>
            <Button variant="link" asChild><Link href="/agent/properties/add-property">Start adding now</Link></Button>
          </div>
        )}
      </div>
      {/* Pagination */}
      <PropertyPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} className="justify-end" />
    </section>
  )
}

export default AgentPropertiesPage;