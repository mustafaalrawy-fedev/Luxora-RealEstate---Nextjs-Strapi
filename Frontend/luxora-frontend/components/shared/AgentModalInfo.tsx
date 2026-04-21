"use client";
import { AgentModalInfoState } from "@/store/useAgentModalInfoStore";
import Image from "next/image";
import { Button } from "../ui/button";
import { X, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from "framer-motion";

const AgentModalInfo = ({ 
    setAgentModalClose, 
    agentSocialLinks 
}: { 
    setAgentModalClose: () => void; 
    agentSocialLinks: AgentModalInfoState['agentSocialLinks']
}) => {
 
  const socialIcons = [
    { name: 'Facebook', link: agentSocialLinks?.links?.facebook ? `https://www.facebook.com/${agentSocialLinks.links.facebook}` : null, icon: {src: "/images/social-icons/facebook.svg", alt: "Facebook"}},
    { name: 'Instagram', link: agentSocialLinks?.links?.instagram ? `https://www.instagram.com/${agentSocialLinks.links.instagram}` : null, icon: {src: "/images/social-icons/instagram.svg", alt: "Instagram"}},
    { name: 'Twitter', link: agentSocialLinks?.links?.twitter ? `https://www.twitter.com/${agentSocialLinks.links.twitter}` : null, icon: {src: "/images/social-icons/twitter.svg", alt: "Twitter"}},
    { name: 'LinkedIn', link: agentSocialLinks?.links?.linkedin ? `https://www.linkedin.com/${agentSocialLinks.links.linkedin}` : null, icon: {src: "/images/social-icons/linkedin.svg", alt: "LinkedIn"}},
  ];

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='absolute inset-0 bg-black/40 backdrop-blur-sm' 
            onClick={setAgentModalClose}
        ></motion.div>

        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className='relative bg-card border border-border shadow-2xl rounded-3xl max-w-2xl w-full flex overflow-hidden'
        >
            {/* Left Sidebar: Photo & Status */}
            <div className="hidden md:flex flex-col w-1/3 bg-gradient-to-b from-primary/50 to-primary/5  items-center justify-center border-r border-border">
                <div className="relative w-full h-full ">
                    {agentSocialLinks?.agent?.avatar?.url ? (
                        <Image 
                            src={agentSocialLinks?.agent?.avatar?.url} 
                            alt={agentSocialLinks?.agent?.username || "Agent"} 
                            fill className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                </div>
                {/* Available Status That will Added Later */}
                {/* <div className="text-center">
                    <div className="w-2 h-2 bg-success rounded-full inline-block mr-2"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available</span>
                </div> */}
            </div>

            {/* Right Side: Details */}
            <div className="flex-1 p-8 md:p-10 relative">
                <Button onClick={setAgentModalClose} variant="ghost" className="absolute top-4 right-4 rounded-full h-8 w-8 hover:bg-secondary">
                    <X className="w-4 h-4" />
                </Button>

                <h2 className="text-2xl font-bold mb-1">{agentSocialLinks?.agent?.username}</h2>
                {/* <p className="text-primary text-sm font-medium mb-6">Luxora Luxury Estate Agent</p> */} {/* This Will Be Added From Strapi Api Later */}
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    {agentSocialLinks?.agent?.bio || "Expert in high-end residential properties and investment portfolios in the MENA region."}
                </p>

                {/* Main Action */}
                {agentSocialLinks?.whatsapp && (
                    <Button asChild className="w-full bg-success hover:bg-success/90 text-white rounded-sm gap-2 mb-8">
                        <a href={`https://wa.me/${agentSocialLinks.whatsapp}`} target="_blank" rel="noreferrer">
                            <MessageCircle className="w-5 h-5" /> Message on WhatsApp
                        </a>
                    </Button>
                )}

                {/* Social Section */}
                <div className="flex items-center justify-between border-t border-border pt-6">
                    <span className="text-sm font-medium">Follow Agent</span>
                    <div className="flex gap-4">
                        {socialIcons.map((item, idx) => item.link && (
                            <a key={idx} href={item.link} target="_blank" rel="noreferrer" 
                               className="p-2.5 rounded-full dark:bg-foreground bg-background dark:hover:bg-primary hover:bg-primary transition-colors group">
                                <Image src={item.icon.src} alt={item.icon.alt} width={18} height={18} className="opacity-70 group-hover:opacity-100" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center border-t border-border pt-4">
                    <Button variant="link" className="text-xs flex items-center justify-center gap-3 mx-auto">
                        VIEW FULL PORTFOLIO <ExternalLink className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </motion.div>
    </div>  
  )
}

export default AgentModalInfo;