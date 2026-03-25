import { create } from 'zustand'
import { Animal } from '@/types/schema/animal.schema'
import { AnimalType } from '@/types/schema/animalType.schema'

interface AnimalTypeState {
  editingAnimalType: AnimalType | null
  isEditing: boolean
  setEditingAnimalType: (animalType: AnimalType | null) => void
  clearEditing: () => void
}

export const useControlAnimalType = create<AnimalTypeState>((set) => ({
  editingAnimalType: null,
  isEditing: false,
  setEditingAnimalType: (animalType) => set({ editingAnimalType: animalType, isEditing: true }),
  clearEditing: () => set({ editingAnimalType: null, isEditing: false }),
}))