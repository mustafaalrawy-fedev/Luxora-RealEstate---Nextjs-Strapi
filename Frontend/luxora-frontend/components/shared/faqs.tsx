import { ChevronDown } from "lucide-react"
import { FAQS } from "@/constants"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const Faqs = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-card rounded-sm border border-border overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-primary hover:text-black transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown className={`transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* <div className="p-6 text-muted-foreground leading-relaxed border-t-2 border-primary"> */}
                      <div className="p-6 text-muted-foreground bg-card leading-relaxed border-t border-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
  )
}   

export default Faqs