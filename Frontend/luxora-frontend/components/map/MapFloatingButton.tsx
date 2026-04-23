"use client";

import { Map as MapIcon, X } from "lucide-react";
import { useMapStore } from "@/store/useMapStore";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

export const MapFloatingButton = () => {
  const { isMapVisible, toggleMap, coords, districtName } = useMapStore();

  return (
    <AnimatePresence>
      {coords && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            onClick={toggleMap}
            size="lg"
            className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 gap-3 border-2 border-background/20 backdrop-blur-md"
          >
            {isMapVisible ? <X size={20} /> : <MapIcon size={20} />}
            <span className="font-bold tracking-tight">
              {isMapVisible ? "Close Map" : `Show ${districtName} Map`}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};