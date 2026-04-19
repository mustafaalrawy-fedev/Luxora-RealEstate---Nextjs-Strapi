"use client"

import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
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
import InquiryForm from '../forms/InquiryForm'

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
      property_type: { populate: "*" },
      district: { populate: { city: { populate: "country" } } },
      agent: { populate: "*" }
    },
  }, { encodeValuesOnly: true });
  
    const { data, isLoading, error, isPlaceholderData } = useQuery<PropertyDetails[]>({
        queryKey: ['property', slug],
        queryFn: async () => {
            const response = await axiosInstance.get(`/properties?${query}`)
            // تأكد من مسار البيانات الصحيح في Strapi
            return response?.data?.data
        },
        // 1. تقليل وقت staleTime ليتم التحديث بشكل أسرع عند العودة للصفحة
        staleTime: 1000 * 60 * 1, // دقيقة واحدة
        // 2. إضافة refetchOnWindowFocus لضمان التحديث عند العودة للمتصفح
        refetchOnWindowFocus: true,
    })

    // تحسين حالة التحميل: استخدم isLoading فقط للتحميل الأول
    // بينما استمر في عرض البيانات القديمة أثناء جلب البيانات الجديدة في الخلفية
    if (isLoading) return <PropertiesSkeleton count={1} /> 
    if (error) return <ErrorState variant="All" />
    if (!data || data.length === 0) return <div className="p-20 text-center">Property Not Found</div>

    // بما أننا نستخدم filter slug، فمن المفترض وجود عنصر واحد فقط
    const property = data[0];
    const { 
        id, price, area_size_sqft, bedroom, bathroom, build_year, 
        property_status, property_name, featured_image, 
        short_description, long_description, media, 
        amenities, property_type, district, agent, developer, construction_status
    } = property;

  return (
    <>
    <div className={cn("w-full transition-opacity duration-300", isPlaceholderData && "opacity-50")}>
        <section key={id} className='flex flex-col gap-10 h-fit w-full'>
            <div className='flex flex-col lg:flex-row justify-between w-full h-fit items-center gap-20'>
                <div className='w-full flex flex-col gap-5'>
                    <Badge className='text-sm w-fit' variant="outline">{property_type?.type_name}</Badge>
                    <h1 className="text-4xl font-bold">{property_name}</h1>
                    <p className="text-muted-foreground text-lg">{short_description}</p>
                    <div className='flex items-center gap-2'>
                        <MapPin className={cn("w-5 h-5 text-primary", property_status === 'Rent' && "text-secondary")} />
                        <p className={cn("text-primary font-medium", property_status === 'Rent' && "text-secondary")}> 
                            {district?.district_name}, {district?.city?.city_name}, {district?.city?.country?.country_name}
                        </p>
                    </div>
                </div>
                <div className='relative w-full h-[50vh]'>
                    {featured_image?.url && (
                        <Image 
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${featured_image.url}`} 
                            alt={featured_image.alternativeText || property_name} 
                            fill 
                            className='object-cover rounded-2xl shadow-xl' 
                            unoptimized 
                            priority
                        />
                    )}
                </div>
            </div>

            {/* Gallery */}
            <div className='w-full mt-10'>
                <h6 className='text-2xl font-bold mb-5'>Gallery</h6>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {media?.map((image) => (
                        <div key={image.id} className='relative w-full h-[30vh] group overflow-hidden rounded-xl'>
                            <Image 
                                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`} 
                                alt={image.alternativeText || "Gallery Image"} 
                                fill 
                                className='object-cover group-hover:scale-110 transition-transform duration-500' 
                                unoptimized 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Details & Sidebar */}
            <article className='mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-2 space-y-10'>
                    {/* Description */}
                    <div className='w-full'>
                        <h6 className='text-2xl font-bold mb-5'>Description</h6>
                        <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{long_description}</p>
                    </div>

                    {/* Amenities */}
                    <div className='w-full mt-10'>
                        <h6 className='text-2xl font-bold mb-5'>Amenities</h6>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            {amenities?.map((amenity: { id: number, amenity_name: string, category: string, short_description: string, slug: string, amenity_image: { url: string, alternativeText: string } }) => (
                                <div key={amenity.id} className='flex items-center gap-2 border border-border bg-card w-full h-40 sticky top-40 rounded-xl'>
                                    <Image key={amenity.id} loading='lazy' src={`http://localhost:1337${amenity?.amenity_image?.url}`} alt={amenity?.amenity_image?.alternativeText} width={24} height={24} className='object-cover rounded-r-xl w-full h-full' unoptimized />
                                    <aside className='flex flex-col w-full p-8'>
                                        <h6>{amenity.amenity_name}</h6>
                                        <p>{amenity.short_description}</p>
                                    </aside>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> 

                {/* Sidebar Card */}
                <aside className='w-full h-fit sticky top-24 space-y-6'>
                    <div className="bg-card p-6 rounded-2xl border shadow-sm">
                        <Badge className='text-lg mb-4' variant={property_status === 'Sale' ? 'default' : 'secondary'}>For {property_status}</Badge>
                        <h3 className={cn("text-3xl font-bold text-primary mb-6", property_status === 'Rent' && "text-secondary")}>{formatCurrency(price)}</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className='flex items-center justify-between text-sm py-2 border-b'>
                                <span className="text-muted-foreground">Living Space</span>
                                <span className="font-bold">{area_size_sqft} sqft</span>
                            </div>
                            <div className='flex items-center justify-between text-sm py-2 border-b'>
                                <span className="text-muted-foreground">Bedrooms</span>
                                <span className="font-bold">{bedroom}</span>
                            </div>
                            <div className='flex items-center justify-between text-sm py-2 border-b'>
                                <span className="text-muted-foreground">Bathrooms</span>
                                <span className="font-bold">{bathroom}</span>
                            </div>
                            <div className='flex items-center justify-between text-sm py-2 border-b'>
                                <span className="text-muted-foreground">Developer</span>
                                <span className="font-bold">{developer || "N/A"}</span>
                            </div>
                            <div className='flex items-center justify-between text-sm py-2 border-b'>
                                <span className="text-muted-foreground">Construction Status</span>
                                <span className="font-bold">{construction_status || "N/A"}</span>
                            </div>
                            <div className='flex items-center justify-between text-sm py-2 border-b'>
                                <span className="text-muted-foreground">Build Year</span>
                                <span className="font-bold">{build_year ? new Date(build_year).getFullYear() : "N/A"}</span>
                            </div>
                        </div>

                        {/* Agent Info */}
                        <div className='flex items-center gap-4 p-4 rounded-xl bg-muted/50 mb-6'>
                            <div className="relative w-12 h-12">
                                <Image 
                                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${agent?.avatar?.url}`} 
                                    alt={agent?.username} 
                                    fill 
                                    className='object-cover rounded-full border-2 border-background' 
                                    unoptimized 
                                />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Listed by</p>
                                <p className="font-bold">{agent?.username}</p>
                            </div>
                        </div>

                        <Button className={cn("w-full py-6 text-lg gap-2 hover:gap-4 transition-all", property_status === 'Rent' && "bg-secondary hover:bg-secondary/80")}>
                            Have Questions? <ArrowRight size={20} />
                        </Button>
                    </div>
                </aside>
            </article>
        </section>
    </div>
    <InquiryForm propertyId={id} agentId={agent?.id} />
    </>
  )
}
    