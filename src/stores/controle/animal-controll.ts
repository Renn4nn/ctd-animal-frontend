import { create } from 'zustand'
import { Animal } from '@/types/schema/animal.schema'

interface AnimalState {
  editingAnimal: Animal | null
  isEditing: boolean
  setEditingAnimal: (animal: Animal | null) => void
  clearEditing: () => void
}

export const useControlAnimal = create<AnimalState>((set) => ({
  editingAnimal: null,
  isEditing: false,
  setEditingAnimal: (animal) => set({ editingAnimal: animal, isEditing: true }),
  clearEditing: () => set({ editingAnimal: null, isEditing: false }),
}))