"use client"

import MainHeading from "@/components/shared/MainHeading"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"
import OurSponsor from "@/components/shared/our-sponsor"
import Faqs from "@/components/shared/faqs"


const AboutUs = () => {

  const { data: session } = useSession();

  return (
    <>
      <section className='h-[80vh] w-full relative'>
        {/* Hero Section */}
        <div className="flex items-center justify-center h-full w-full">
          <Image 
            src="https://images.unsplash.com/photo-1635111031688-9b13c0125d12?w=1200&auto=format&fit=crop&q=80" 
            alt="Luxora Estate" 
            fill 
            className="object-cover" 
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="container-space z-20 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Our Legacy</h1>
            <p className="max-w-2xl text-lg md:text-xl mx-auto text-white/90 font-light leading-relaxed">
              Luxora is more than a real estate platform. We are the curators of the MENA region&apos;s most prestigious architectural masterpieces, connecting visionary investors with exceptional living spaces.
            </p>
          </div>
        </div>      
      </section>

      {/* About Content Section */}
      <section className="container-space py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] w-full group">
            <Image 
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D" 
              alt="Modern Villa" 
              fill 
              className="object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Decorative element using your brand color #fa915c */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 z-10 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-8">
            <MainHeading 
              title="Elevating the Standard" 
              description="Founded in 2025, Luxora was built to eliminate the friction in luxury real estate. We combine cutting-edge Next.js technology with deep market expertise." 
            />
            
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">$2B+</h3>
                <p className="text-muted-foreground font-medium">Property Portfolio</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">500+</h3>
                <p className="text-muted-foreground font-medium">Expert Agents</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">12+</h3>
                <p className="text-muted-foreground font-medium">MENA Cities</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">24/7</h3>
                <p className="text-muted-foreground font-medium">Premium Support</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6">
              &quot; Our mission is to ensure that every client experience is as seamless and sophisticated as the properties we represent. &quot;
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container-space">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Luxora Pillars</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Transparency", desc: "Every listing is verified through our Strapi-powered backend for 100% accuracy." },
              { title: "Exclusivity", desc: "Access to off-market luxury units that you won't find on any other platform." },
              { title: "Innovation", desc: "Experience 3D tours and interactive layouts powered by Spline and Rive." }
            ].map((value, idx) => (
              <div key={idx} className="bg-card p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold mb-4">{value.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQs Section */}
      <section className="container-space py-24 flex items-center justify-between gap-8">
        <div className=" w-full flex-1">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about the Luxora ecosystem.</p>
          </motion.div>

          <Faqs />
        </div>
        <div className="w-full flex-1">
        <Image src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D" alt="FAQ" width={500} height={500} className="w-full h-full object-cover rounded-xl" />
        </div>
      </section>

      {/* Our Sponsors (Infinite Scroll Animation) */}
      <OurSponsor />

      {/* Final CTA Section (Recommended) */}
      <section className="py-24 container-space">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card rounded-[2.5rem] p-12 md:p-20 text-center text-foreground relative overflow-hidden"
        >
          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join the Legacy?</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
              Whether you are looking for your dream home or listing a masterpiece, our platform provides the tools you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Button className="" variant="secondary">
                Register as Buyer
              </Button>
              <Button className="" variant="default">
                Join as Agent
              </Button> */}
              <Link href="/properties" className="">
                <Button className="" variant="default">
                  Show Properties
                </Button>
              </Link>
              {
                !session ? (
                  <Link href="/register" className="">
                    <Button className="" variant="secondary">
                      Join As Agent
                    </Button>
                  </Link>
                ) : (
                  <Link href="/agent" className="">
                    <Button className="" variant="secondary">
                      Go to Dashboard
                    </Button>
                  </Link>
                )
              }
            </div>
          </div>
        </motion.div>
      </section>

      
    </>
  )
}

export default AboutUs