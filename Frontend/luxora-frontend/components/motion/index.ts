// components/motion/index.ts
import { Variants } from "motion/react";

/**
 * حركة ظهور الحاوية الرئيسية
 * تقوم بعمل stagger لظهور العناصر الابناء واحد تلو الآخر
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * حركة العناصر الفردية (الكروت)
 * تشمل الدخول، البقاء، والخروج بسلاسة
 */
export const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.97,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 1, 0.5, 1] // Custom cubic-bezier ليكون الانيميشن أكثر فخامة
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.97,
    transition: { duration: 0.2 } 
  },
};