import { create } from 'zustand';

interface MapState {
  isMapVisible: boolean;
  coords: { lat: number; lng: number } | null;
  districtName: string | null;
  setCoords: (lat: number, lng: number, name: string) => void;
  toggleMap: () => void;
  closeMap: () => void;
  setClearCoords: () => void;
}

const params = new URLSearchParams(window.location.search);
const isMapVisible = params.get("district") ? true : false;

export const useMapStore = create<MapState>((set) => ({
  coords: null,
  districtName: null,
  isMapVisible: isMapVisible,
  setCoords: (lat, lng, name) => set({ coords: { lat, lng }, districtName: name }),
  setClearCoords: () => set({ coords: null, districtName: null }),
  toggleMap: () => set((state) => ({ isMapVisible: !state.isMapVisible })),
  closeMap: () => set({ isMapVisible: false }),
}));