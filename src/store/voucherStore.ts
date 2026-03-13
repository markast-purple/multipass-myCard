import { create } from "zustand";

interface VoucherState {
  activeColorIndex: number;
  setActiveColorIndex: (index: number) => void;
}

export const useVoucherStore = create<VoucherState>((set) => ({
  activeColorIndex: 0,
  setActiveColorIndex: (index: number) => set({ activeColorIndex: index }),
}));
