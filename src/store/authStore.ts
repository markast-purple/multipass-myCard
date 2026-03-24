import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  phoneNumber: string | null;
  setAccessToken: (token: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  clearAccessToken: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      phoneNumber: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      clearAccessToken: () => set({ accessToken: null }),
      clearAuth: () => set({ accessToken: null, phoneNumber: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        phoneNumber: state.phoneNumber,
      }),
    },
  ),
);
