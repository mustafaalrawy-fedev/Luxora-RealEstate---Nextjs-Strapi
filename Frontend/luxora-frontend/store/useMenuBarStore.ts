import {create} from "zustand";

export const useMenuBarStore = create((set) => ({
    isMenuOpen: false,
    toggleMenu: () => set((state: { isMenuOpen: boolean; }) => ({ isMenuOpen: !state.isMenuOpen })),
    closeMenu: () => set({ isMenuOpen: false }),
    openMenu: () => set({ isMenuOpen: true }),
}))