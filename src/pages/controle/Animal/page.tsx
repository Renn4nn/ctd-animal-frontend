import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "../data-table"
import { columnsAnimal, type Animal } from "./columns"
import { useState } from "react"

const data: Animal[] = [
  { id: "1", name: "Rex", status: "Disponível", breed: "Vira-lata", sex: "Macho", typeId: 1, age: "2 anos", vaccines: ["Raiva"], size: "Médio", description: "", behavior: "", story: "", photos: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Bobby", status: "Disponível", breed: "Poodle", sex: "Macho", typeId: 1, age: "1 ano", vaccines: [], size: "Pequeno", description: null, behavior: null, story: null, photos: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Kiosk", status: "Adotado", breed: "Siamês", sex: "Fêmea", typeId: 2, age: "3 anos", vaccines: ["V4"], size: "Pequeno", description: null, behavior: null, story: null, photos: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "Luna", status: "Disponível", breed: "Labrador", sex: "Fêmea", typeId: 1, age: "4 anos", vaccines: ["Raiva", "Leptospirose"], size: "Grande", description: "Cara e brincalhona", behavior: "Amigável", story: "Encontrada abandonada", photos: [], createdAt: new Date(), updatedAt: new Date() },
]

export default function AnimalPage() {
  const [filterValue, setFilterValue] = useState("")

  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Listagem de Animais
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
          placeholder="Pesquisar por nome ou raça..."
          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      <DataTable columns={columnsAnimal} data={data} filterValue={filterValue} onFilterChange={setFilterValue} />
    </main>
  )
}