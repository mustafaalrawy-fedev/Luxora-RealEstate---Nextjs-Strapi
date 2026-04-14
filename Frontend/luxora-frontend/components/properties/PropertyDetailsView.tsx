"use client"

import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import PropertyDetailsResponse from '@/types/property'
import PropertyDetails from '@/types/property'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { MapPin, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import qs from 'qs'
import { cn } from '@/lib/utils'
import { PropertiesSkeleton } from '../shared/LoadingState'
import ErrorState from '../shared/ErrorState'

export default function PropertyDetailsView({ slug }: { slug: string }) {
    
    const query = qs.stringify({
    filters: {
      slug: { $eq: slug },
    },
    populate: {
      amenities: {
        populate: {
          amenity_image: { populate: "*" }
        }
      },
      media: { populate: "*" },
      featured_image: { populate: "*" },
      // Add other relations here easily
      property_type: { populate: "*" },
      district: { populate: { city: { populate: "country" } } },
    },
  }, { encodeValuesOnly: true });
  
    const { data, isLoading, error } = useQuery<PropertyDetailsResponse>({
        queryKey: ['property', slug],
        queryFn: async () => {
            const response = await axiosInstance.get(`/properties?${query}`)
            return response?.data?.data
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    if (isLoading) return <PropertiesSkeleton count={1} /> // need to be optimized
    if (error) return <ErrorState variant="All" />

    console.log(data)

  return (
    <div className="w-full">
        {/* Property Cards will go here  */}
        {data?.map((property: PropertyDetails) => {
            const { id, price, area_size_sqft, bedroom, bathroom, property_status, property_name, featured_image, short_description, long_description, media, amenities, property_type, district } = property
            return (
                <section key={id} className='flex flex-col gap-10 h-fit w-full'>
                    <div className='flex flex-col lg:flex-row justify-between w-full h-fit items-center gap-20'>
                        <div className='w-full flex flex-col gap-5'>
                            <Badge className='text-sm' variant="outline">{property_type.type_name}</Badge>
                            <h1>{property_name}</h1>
                            <p>{short_description}</p>
                            <div className='flex items-center gap-2'>
                                <MapPin className={cn("w-5 h-5 text-primary", property_status === 'Rent' && "text-secondary")} />
                                <p className={cn("text-primary", property_status === 'Rent' && "text-secondary")}> {district?.district_name}, {district?.city?.city_name}, {district?.city?.country?.country_name}</p>
                            </div>
                        </div>
                        <div className='relative w-full h-[50vh]'>
                            <Image key={featured_image.id} loading='eager' priority src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${featured_image.url}`} alt={featured_image.alternativeText} fill className='object-cover rounded-2xl' unoptimized />
                        </div>
                    </div>
                    {/* Gallery */}
                    <div className='w-full mt-10'>
                        <h6 className='text-2xl font-bold mb-5'>Gallery</h6>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                            {media?.map((image: { id: number, url: string, alternativeText: string }) => (
                                <div key={image.id} className='relative w-full h-[30vh]'>
                                    <Image key={image.id} loading='eager' priority src={`http://localhost:1337${image.url}`} alt={image.alternativeText} fill className='object-cover rounded-xl' unoptimized />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Details */}
                    <article className='mt-20 grid grid-cols-1 md:grid-cols-2 gap-10'>
                        {/* Details */}
                        <aside className='w-full'>
                            <div className='flex flex-col gap-8'>
                                <Badge className='text-lg' variant={property_status === 'Sale' ? 'default' : 'secondary'}>{property_status}</Badge>
                                {/* Location */}
                                <div className='flex items-center gap-2'>
                                    <MapPin className='w-5 h-5' />
                                    <p> {district?.district_name}, {district?.city?.city_name}, {district?.city?.country?.country_name}</p>
                                </div>
                                {/* Short Description */}
                                <p>{short_description}</p>
                                {/* Price */}
                                <div className='flex items-end gap-2'>
                                    <h6>{formatCurrency(price)}</h6>
                                </div>
                                {/* contact button */}
                                <Button className='w-fit flex items-center gap-2 hover:gap-5' variant={'default'}>Have Question ? <ArrowRight /> </Button>
                            </div>
                        </aside>
                        <aside className='w-full bg-card p-5 rounded-2xl'>
                            <h6 className='mb-5'>Details</h6>
                            <div className='flex flex-col'>
                                {/* Agent */}
                                <div className='flex items-center justify-between py-4 border-b border-border'>
                                    <p>Agent</p>
                                    <div>
                                        {/* Avatar */}
                                        {/* Agent Name */}
                                    </div>
                                </div>
                                {/* Developer */}
                                <div className='flex items-center justify-between py-4 border-b border-border'>
                                    <p>Developer</p>
                                    <div>
                                        {/* Logo */}
                                        {/* Developer Name */}
                                    </div>
                                </div>
                                {/* Construction Status */}
                                <div className='flex items-center justify-between py-4 border-b border-border'>
                                    <p>Construction Status</p>
                                    {/* Status */}
                                </div>
                                {/* Living Spacee / Area Size */}
                                <div className='flex items-center justify-between py-4 border-b border-border'>
                                    <p>Living Space</p>
                                    <p>{area_size_sqft}</p>
                                </div>
                                {/* Bedrooms */}
                                <div className='flex items-center justify-between py-4 border-b border-border'>
                                    <p>Bedrooms</p>
                                    <p>{bedroom}</p>
                                </div>
                                {/* Bathrooms */}
                                <div className='flex items-center justify-between py-4'>
                                    <p>Bathrooms</p>
                                    <p>{bathroom}</p>
                                </div>
                            </div>
                        </aside>
                    </article>
                    {/* Description */}
                    <div className='w-full mt-10'>
                        <h6 className='text-2xl font-bold mb-5'>Description</h6>
                        <p>{long_description}</p>
                    </div>
                    {/* Amenities */}
                        <div className='w-full mt-10'>
                            <h6 className='text-2xl font-bold mb-5'>Amenities</h6>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                {amenities?.map((amenity: { id: number, amenity_name: string, category: string, short_description: string, slug: string, amenity_image: { url: string, alternativeText: string } }) => (
                                    <div key={amenity.id} className='flex items-center gap-2 rounded-md bg-card w-full h-72 sticky top-40'>
                                        <aside className='flex flex-col w-full p-8'>
                                            <h6>{amenity.amenity_name}</h6>
                                            <p>{amenity.short_description}</p>
                                        </aside>
                                        <Image key={amenity.id} loading='lazy' src={`http://localhost:1337${amenity?.amenity_image?.url}`} alt={amenity?.amenity_image?.alternativeText} width={24} height={24} className='object-cover rounded-xl w-full h-full' unoptimized />
                                    </div>
                                ))}
                            </div>
                        </div>
                    {/* Contact Form */}
                </section>
            )
            } 
        )} 
    </div>
  )
}