"use client";
 
import { motion, AnimatePresence } from "motion/react";
import Map from "./Map";
import { useMapStore } from "@/store/useMapStore";

export const MapDisplay = () => {
const { isMapVisible, coords } = useMapStore();

  return (
    <AnimatePresence>
      {isMapVisible && coords && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl p-4 md:p-28 flex items-center justify-center"
        >
          <div className="w-full h-full rounded-[2.5rem] border border-border/50 overflow-hidden shadow-2xl relative">
             {/* Map Component (Leaflet / Google Maps / Mapbox) */}
             <Map />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};