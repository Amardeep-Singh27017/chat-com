import { create } from "zustand";

const useUIStore = create((set) => ({
  showSidebar: false,

  openSidebar: () => set({ showSidebar: true }),
  closeSidebar: () => set({ showSidebar: false }),
  toggleSidebar: () =>
    set((state) => ({ showSidebar: !state.showSidebar })),
}));

export default useUIStore;