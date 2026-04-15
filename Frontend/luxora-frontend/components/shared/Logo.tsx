import { Flower } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const Logo = ({showText = true, showIcon = true}: {showText?: boolean, showIcon?: boolean}) => {
  return (
    <>
    <aside className="flex items-center justify-center gap-2">
    {showIcon && <Flower className="size-10 text-primary" />}
    {showText && (
      <AnimatePresence mode="wait">
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        >
            <h6 className="text-md font-bold">Luxora</h6>
            <p className="text-xs font-light">Real Estate</p>
        </motion.div>
      </AnimatePresence>
    )}
    </aside>
    </>
  )
}

export default Logo