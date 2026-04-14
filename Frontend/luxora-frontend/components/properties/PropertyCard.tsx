import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Bed, Bath, Square, ArrowRight, MapPin } from "lucide-react";
import PropertyDetails from "@/types/property";
import Link from 'next/link'
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";

export default function PropertyCard (property: PropertyDetails) {
    const { id, price, area_size_sqft, bedroom, bathroom, property_status, property_name, property_type, featured_image, slug, district } = property

    // const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL as string
    // // Extract the image URL safely
    // const imageRelativePath = featured_image?.url;
    // const fullImageUrl = imageRelativePath 
    //     ? `${STRAPI_URL}${imageRelativePath}` 
    //     : '/images/homehero.jpg'; // Fallback image

  return (
    <Link href={`/properties/${slug}`}>
        <article className="h-fit w-full bg-card rounded-lg group-[property-card]:hover:scale-105 transition-all duration-300" key={id}>
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
                <Image unoptimized loading="lazy" src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${featured_image?.url}`} alt="Hero" fill className='object-cover h-full absolute top-0 left-0 right-0 bottom-0 z-10'/>
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <Badge className="absolute top-4 left-4 z-20" variant={property_status === 'Sale' ? 'default' : 'secondary'}>{property_status}</Badge>
            </div>
            <div className="p-4 flex flex-col gap-4">
                <aside className="flex justify-between items-start w-full">
                    <div className="relative z-20 text-left">
                        <p className="text-sm text-muted-foreground mb-2.5">{property_type.type_name}</p>
                        <h6 className="font-bold text-lg">{property_name}</h6>
                        {/* Location */}
                        <div className="flex items-center gap-2">
                            <MapPin className={cn("w-5 h-5 text-primary", property_status === 'Rent' && "text-secondary")} />
                            <p className="text-sm"> {district?.district_name}, {district?.city?.city_name}, {district?.city?.country?.country_name}</p> 
                        </div>
                    </div>
                    <div className="relative z-20 text-right">
                        <h6 className={cn("text-primary w-max text-xl", property_status === 'Rent' && "text-secondary")}>{formatCurrency(price)}</h6>
                        {property_status === 'Sale' ? (
                            <p className="text-xs">{formatCurrency(price / area_size_sqft)} / sqft</p>
                        ) : (
                            <p className="text-xs">{formatCurrency(price)} / month</p>
                        )}
                    </div>
                </aside>

                <div className="divider"></div>
        
                <div className="flex justify-between items-center w-full px-4">
                    <div className="flex justify-between items-center gap-4 w-full">
                        <p className='flex justify-center items-center gap-2 text-sm'><Bed /> {bedroom} Beds</p>
                        <p className='flex justify-center items-center gap-2 text-sm'><Bath /> {bathroom} Baths</p>
                        <p className='flex justify-center items-center gap-2 text-sm'><Square /> {area_size_sqft} sqft</p>
                    </div>
                </div>
                <Button className="w-full rounded-md flex justify-center items-center gap-2 hover:gap-4" variant={property_status === 'Sale' ? 'default' : 'secondary'}>View Details <ArrowRight /></Button>
            </div>
        </article>
    </Link>
  )
}