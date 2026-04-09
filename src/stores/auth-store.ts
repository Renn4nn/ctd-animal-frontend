import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  sessionToken: string | null;
  operationLogin: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  login: (login: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionToken: null,
      operationLogin: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      login: (login, token) => {
        set({
          sessionToken: token,
          operationLogin: login.trim().toLowerCase(),
          hydrated: true,
        });
      },
      logout: () =>
        set({
          sessionToken: null,
          operationLogin: null,
          hydrated: true,
        }),
    }),
    {
      name: "login-information",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ sessionToken, operationLogin }) => ({ sessionToken, operationLogin }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
