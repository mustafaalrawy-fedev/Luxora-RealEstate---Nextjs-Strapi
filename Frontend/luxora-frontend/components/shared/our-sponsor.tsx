import { SPONSORS } from "@/constants"
import { motion } from "framer-motion"

const OurSponsor = () => {
  return (
    <section className="py-20 border-y border-border bg-card overflow-hidden">
        <div className="container-space">
          <p className="text-center text-sm font-bold tracking-widest uppercase text-foreground mb-12">Our Partners & Affiliates</p>
          
          <div className="relative flex overflow-x-hidden mask-linear-to-r from-transparent via-black to-transparent">
            <motion.div 
              className="flex whitespace-nowrap gap-16 items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {/* <Image src={sponsor.image} alt={sponsor.name} width={24} height={24} className="w-6 h-6 object-contain" /> */}
                  <p className="text-muted-foreground/40 hover:text-primary transition-colors cursor-default">
                    {sponsor.name}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
  )
}

export default OurSponsor