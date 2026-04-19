"use client"

import axiosInstance from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import PropertyDetailsResponse from '@/types/property'
import MainHeading from "../shared/MainHeading";
import PropertyCard from "./PropertyCard";
import { PropertiesSkeleton } from "../shared/LoadingState";
import ErrorState from "../shared/ErrorState";
import qs from 'qs'

/*
=============================================
Start Featured Properties Component
=============================================
*/
export default function FeaturedProperties () {

  const query = qs.stringify({
    populate: {
      featured_image: { populate: "*" },
      district: { populate: { city: { populate: "country" } } },
      property_type: { populate: "*" },
    },
    filters: {
      featured: { $eq: true },
    },
    pagination: {
      limit: 6,
    },
    sort: 'createdAt:desc',
  }, {encodeValuesOnly: true})

    const { data, isLoading, error } = useQuery({
        queryKey: ['featured-properties'],
        queryFn: async() => {
            const res = await axiosInstance.get(`/properties?${query}`) // featured properties
            return res.data.data
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    // if (isLoading) return <div>Loading...</div>
    // if (error) return <div>Error...</div>

  return (
    <section className="container-space py-20 h-fit">
      <MainHeading title="Featured Properties" description="Premium real estate designed for those who seek sophistication, exclusivity, and timeless value." buttonText="View All Properties" buttonLink="/properties" buttonVariant="outline" showButton={true} />
      {isLoading ? <PropertiesSkeleton count={3} /> : error ? <ErrorState variant="Featured" /> : (
        data?.length === 0 ? (
            <ErrorState variant="Featured" />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Cards will go here  */}
            {data?.map((property: PropertyDetailsResponse) => {
                return <PropertyCard key={property.id} {...property}/>
                } 
            )} 
        </div>
        )
      )}
    </section>
  )
}
/*
=============================================
End Featured Properties Component
=============================================
*/



/*
=============================================
Start Property Card Component
=============================================
*/

/*
=============================================
End Property Card Component
=============================================
*/
