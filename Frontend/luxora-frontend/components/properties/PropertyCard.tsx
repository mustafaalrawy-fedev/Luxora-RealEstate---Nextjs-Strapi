"use client";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Bed, Bath, Square, ArrowRight, MapPin, MessageCircle } from "lucide-react";
import PropertyDetails from "@/types/property";
import Link from 'next/link'
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import AgentModalInfo from "../shared/AgentModalInfo";
import useAgentModalInfoStore from "@/store/useAgentModalInfoStore";
import { motion } from "framer-motion";

export default function PropertyCard(property: PropertyDetails) {
    const { id, price, area_size_sqft, bedroom, bathroom, property_status, property_name, property_type, featured_image, slug, district, agent } = property
    const { setAgentModalOpen, setAgentModalClose, setAgentSocialLinks, agentModalOpen, agentSocialLinks } = useAgentModalInfoStore();

    const isSale = property_status === 'Sale';

    return (
        <>
            <motion.article 
                whileHover={{ y: -8 }}
                className="group relative h-fit w-full bg-card rounded-sm overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500" 
                key={id}
            >
                {/* Top Image Section */}
                <div className="relative h-[280px] w-full overflow-hidden">
                    <Image 
                        unoptimized 
                        loading="lazy" 
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${featured_image?.url}`} 
                        alt={property_name} 
                        fill 
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                    
                    {/* Status Badge */}
                    <Badge 
                        className={cn(
                            "absolute top-5 left-5 z-20 font-bold uppercase tracking-wider",
                            isSale ? "bg-primary text-black" : "bg-secondary text-white"
                        )}
                    >
                        For {property_status}
                    </Badge>

                    {/* Price Overlay on Image */}
                    <div className="absolute bottom-5 left-5 z-20">
                        <h4 className={"text-white text-2xl font-bold"}>
                            {formatCurrency(price)}
                            {!isSale && <span className="text-sm font-normal text-white/80"> / month</span> }
                        </h4>
                        {isSale && <span className="text-sm font-normal text-white/80">{formatCurrency(price / area_size_sqft)} / per sqft</span>}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <span className={cn("text-[10px] uppercase tracking-[0.2em] font-bold", property_status === 'Rent' && "text-secondary")}>
                                {property_type.type_name}
                            </span>
                            <h3 className={cn("font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors", property_status === 'Rent' && "group-hover:text-secondary")}>
                                {property_name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className={cn("w-3.5 h-3.5 text-primary", property_status === 'Rent' && "text-secondary")} />
                                <p className="text-xs truncate">
                                    {district?.district_name}, {district?.city?.city_name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Specs Row - Modern Pills */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium">
                            <Bed className={cn("w-4 h-4 text-primary", property_status === 'Rent' && "text-secondary")} /> {bedroom}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium">
                            <Bath className={cn("w-4 h-4 text-primary", property_status === 'Rent' && "text-secondary")} /> {bathroom}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium">
                            <Square className={cn("w-4 h-4 text-primary", property_status === 'Rent' && "text-secondary")} /> {area_size_sqft} <span className="text-[10px] opacity-60">SQFT</span>
                        </div>
                    </div>

                    {/* Action Buttons - Split Layout */}
                    <div className="flex gap-3">
                        <Button 
                            asChild 
                            variant="outline" 
                            className="flex-1 rounded-xl h-12 border-border hover:bg-secondary group/btn"
                        >
                            <Link href={`/properties/${slug}`} className="gap-2">
                                Details 
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                        
                        <Button 
                            onClick={() => {
                                setAgentModalOpen(); 
                                setAgentSocialLinks({
                                    agent: {
                                        username: agent?.username || '', 
                                        avatar: {url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${agent?.avatar?.url}` || ''}, 
                                        bio: agent?.bio || ''
                                    },
                                    whatsapp: agent?.phone || '', 
                                    links: agent?.social_links || {facebook: '', instagram: '', twitter: '', linkedin: ''}
                                })
                            }} 
                            variant={isSale ? 'default' : 'secondary'} 
                            className="flex-[1.5] rounded-xl h-12 gap-2 shadow-lg shadow-primary/10"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Contact Agent
                        </Button>
                    </div>
                </div>
            </motion.article>

            {/* Agent Modal Info */}
            {agentModalOpen && <AgentModalInfo setAgentModalClose={setAgentModalClose} agentSocialLinks={agentSocialLinks} />}
        </>
    )
}