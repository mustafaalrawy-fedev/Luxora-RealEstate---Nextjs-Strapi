"use client";

import { motion } from "framer-motion";
// import Logo from "./shared/Logo";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut", delay: 1 } 
      }}
      exit={{ opacity: 1 }}
      onAnimationComplete={() => document.body.style.overflow = "unset"}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background pointer-events-none"
    >
      {/* Animated Logo Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: { duration: 0.5, ease: "easeOut" } 
        }}
        className="flex flex-col items-center gap-4"
      >
        {/* <Logo /> */}
        
        {/* Sleek Progress Bar */}
        <div className="w-48 h-[2px] bg-primary/10 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-primary shadow-[0_0_15px_rgba(250,145,92,0.5)]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}