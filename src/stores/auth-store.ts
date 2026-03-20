import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { wait } from "@/lib/mockApi";

const DEMO_LOGIN = "ctd.admin@25!@#";
const DEMO_PASSWORD = "securetepassword123!";

interface AuthState {
  sessionToken: string | null;
  operationLogin: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

export const demoCredentials = {
  login: DEMO_LOGIN,
  password: DEMO_PASSWORD,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionToken: null,
      operationLogin: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      login: async (login, password) => {
        await wait(450);

        const normalizedlogin = login.trim().toLowerCase();

        if (normalizedlogin !== DEMO_LOGIN || password !== DEMO_PASSWORD) {
          throw new Error("Credenciais inválidas. Use o acesso de demonstração informado na tela.");
        }

        set({
          sessionToken: `petmatch-${Date.now()}`,
          operationLogin: normalizedlogin,
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
      name: "petmatch-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ sessionToken, operationLogin }) => ({ sessionToken, operationLogin }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
