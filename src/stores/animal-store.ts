import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ANIMALS } from "@/data/animals";
import { waitRandom } from "@/lib/mockApi";
import type { AdoptionFormValues, AdoptionLog, Animal, AnimalType } from "@/types/animal";

interface AnimalState {
  animals: Animal[];
  activeType: AnimalType;
  isLoading: boolean;
  adoptionLogs: AdoptionLog[];
  setActiveType: (type: AnimalType) => void;
  loadAnimals: () => Promise<void>;
  adoptAnimal: (animalId: string, adopter: AdoptionFormValues) => Promise<void>;
  findAnimal: (animalId: string) => Animal | undefined;
  resetAnimals: () => void;
}

export const useAnimalStore = create<AnimalState>()(
  persist(
    (set, get) => ({
      animals: ANIMALS,
      activeType: "dog",
      isLoading: false,
      adoptionLogs: [],
      setActiveType: (type) => set({ activeType: type }),
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
                  status: "adopted",
                }
              : animal,
          ),
          adoptionLogs: [
            ...get().adoptionLogs,
            {
              animalId,
              adopter,
              adoptedAt: new Date().toISOString(),
            },
          ],
          isLoading: false,
        });
      },
      findAnimal: (animalId) => get().animals.find((animal) => animal.id === animalId),
      resetAnimals: () =>
        set({
          animals: ANIMALS,
          activeType: "dog",
          isLoading: false,
          adoptionLogs: [],
        }),
    }),
    {
      name: "petmatch-animals",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ animals, adoptionLogs, activeType }) => ({ animals, adoptionLogs, activeType }),
    },
  ),
);
