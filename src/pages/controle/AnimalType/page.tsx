import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "../data-table"
import { columnsType } from "./columns"
import { useState } from "react"
import { useControlAnimalType } from "@/stores/controle/animal-type"
import AnimalTypeForm from "../form/AnimalTypeForm"

const mockTypes = [
  { id: 1, label: "Cachorro", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, label: "Gato", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, label: "Pássaro", active: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, label: "Peixe", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, label: "Roedor", active: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, label: "Réptil", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, label: "Anfíbio", active: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, label: "Equídeo", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 9, label: "Felino", active: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 10, label: "Canídeo", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 11, label: "Ovídeo", active: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 12, label: "Suídeo", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 13, label: "Bovídeo", active: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 14, label: "Caprino", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 15, label: "Ovinocaprídeo", active: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 16, label: "Equídeo", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 17, label: "Equídeo", active: true, createdAt: new Date(), updatedAt: new Date() },
];

export default function AnimalTypePage() {
  const [filterValue, setFilterValue] = useState("")

  const { isEditing } = useControlAnimalType()


  if (isEditing) {
    return (
      <main className="p-6">
        <AnimalTypeForm />
      </main>
    )
  }

  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Tipos de Animais
        </h1>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} />
          Novo
        </Button>
      </div>

      <div className="h-px w-full bg-black/5 mb-6" />

      <div className="relative mb-6 max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Filtrar tipos..."
          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      <DataTable columns={columnsType} data={mockTypes} filterValue={filterValue} onFilterChange={setFilterValue} />
    </main>
  )
}