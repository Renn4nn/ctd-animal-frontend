import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { wait } from "@/lib/mockApi";

const DEMO_EMAIL = "teste@teste.com";
const DEMO_PASSWORD = "teste123";

interface AuthState {
  sessionToken: string | null;
  operatorEmail: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const demoCredentials = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionToken: null,
      operatorEmail: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      login: async (email, password) => {
        await wait(450);

        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
          throw new Error("Credenciais inválidas. Use o acesso de demonstração informado na tela.");
        }

        set({
          sessionToken: `petmatch-${Date.now()}`,
          operatorEmail: normalizedEmail,
          hydrated: true,
        });
      },
      logout: () =>
        set({
          sessionToken: null,
          operatorEmail: null,
          hydrated: true,
        }),
    }),
    {
      name: "petmatch-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ sessionToken, operatorEmail }) => ({ sessionToken, operatorEmail }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
