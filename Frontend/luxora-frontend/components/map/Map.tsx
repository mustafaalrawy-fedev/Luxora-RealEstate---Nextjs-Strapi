import { useMapStore } from "@/store/useMapStore";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useEffect } from "react";

// إصلاح مشكلة أيقونات Leaflet الافتراضية في Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// مكون داخلي للتحكم في حركة الكاميرا
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

const Map = () => {
const { isMapVisible, coords, districtName, closeMap } = useMapStore();

  if (!isMapVisible || !coords) return null;

  const position: [number, number] = [coords.lat, coords.lng];
    return (
        <>
          <div className="absolute top-6 left-6 right-6 z-[1000] flex justify-between items-center pointer-events-none">
            <div className="bg-foreground/80 dark:bg-background/80 backdrop-blur-md px-5 py-2 rounded-full border border-border/50 shadow-lg pointer-events-auto">
              <span className="text-sm font-bold tracking-tight text-background dark:text-foreground">
                Exploring: <span className="text-primary">{districtName}</span>
              </span>
            </div>
            <Button 
              onClick={closeMap}
              size="icon" 
              variant="secondary" 
              className="rounded-full shadow-lg pointer-events-auto"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Leaflet Map */}
          <MapContainer
            center={position}
            zoom={14}
            zoomControl={false} // سنخفيه للحفاظ على المظهر المينيمال
            className="w-full h-full z-10"
          >
            {/* لتغيير شكل الخريطة للأسود (Dark Mode) استبدل الـ URL بـ Stadia Maps أو CartoDB */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
            />
            
            <ChangeView center={position} />

            <Marker position={position} icon={customIcon}>
              <Popup className="custom-popup">
                <div className="p-1 font-bold">{districtName}</div>
              </Popup>
            </Marker>
          </MapContainer>
             <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground italic">
                Map Loading at {coords.lat}, {coords.lng}...
             </div>
        </>
    );
};

export default Map;
