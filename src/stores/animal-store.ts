import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { waitRandom } from "@/lib/mockApi";
import { Animal } from "@/types/schema/animal.schema";
import { AdoptionFormValues } from "@/types/adptionLog";
import { AdptionLog } from "@/types/schema/adptionLog.schema";
import { ANIMALS } from "@/data/animals";


interface AnimalState {
  animals: Animal[];
  activeTypeId: number;
  isLoading: boolean;
  adoptionLogs: AdptionLog[];
  setActiveTypeId: (typeId: number) => void;
  loadAnimals: () => Promise<void>;
  adoptAnimal: (animalId: string, adopter: AdoptionFormValues) => Promise<void>;
  findAnimal: (animalId: string) => Animal | undefined;
  resetAnimals: () => void;
}

export const useAnimalStore = create<AnimalState>()(
  persist(
    (set, get) => ({
      animals: ANIMALS,
      activeTypeId: 1,
      isLoading: false,
      adoptionLogs: [],
      setActiveTypeId: (type: number) => set({ activeTypeId: type }),
      loadAnimals: async () => {
        set({ isLoading: true });
        await waitRandom();
        set({ isLoading: false });
      },
      adoptAnimal: async (animalId, adopter) => {
        set({ isLoading: true });
        await waitRandom(500, 900);

        set({
          animals: get().animals.map((animal) =>
            animal.id === animalId
              ? {
                ...animal,
                status: "Adotado",
              }
              : animal,
          ),
          adoptionLogs: [
            {
              animalId,
              adopterName: adopter.name,
              adopterCpf: adopter.cpf,
              adopterPhone: adopter.phone,
              adopterEmail: adopter.email,
              adoptedAt: new Date(),
            },
          ],
          isLoading: false,
        });
      },
      findAnimal: (animalId) => get().animals.find((animal) => animal.id === animalId),
      resetAnimals: () =>
        set({
          animals: ANIMALS,
          activeTypeId: 1,
          isLoading: false,
          adoptionLogs: [],
        }),
    }),
    {
      name: "loginInformation",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ animals, adoptionLogs, activeTypeId }) => ({ animals, adoptionLogs, activeTypeId }),
    },
  ),
);
