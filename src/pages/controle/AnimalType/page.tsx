import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "../data-table"
import { columnsType, AnimalType } from "./columns"

const mockTypes: AnimalType[] = [
  { id: "1", name: "Cachorro", status: "ATIVO" },
  { id: "2", name: "Gato", status: "ATIVO" },
  { id: "3", name: "Pássaro", status: "INATIVO" },
  { id: "4", name: "Peixe", status: "ATIVO" },
  { id: "5", name: "Roedor", status: "INATIVO" },
  { id: "6", name: "Réptil", status: "ATIVO" },
  { id: "7", name: "Anfíbio", status: "INATIVO" },
  { id: "8", name: "Mamífero", status: "ATIVO" },
  { id: "9", name: "Outro", status: "INATIVO" },
  { id: "10", name: "Exótico", status: "ATIVO" },
  { id: "11", name: "Doméstico", status: "INATIVO" },
  { id: "12", name: "Silvestre", status: "ATIVO" },
  { id: "13", name: "Comum", status: "INATIVO" },
  { id: "14", name: "Raro", status: "ATIVO" },
];

export default function AnimalTypePage() {
  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Tipo de Animais
        </h1>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} />
          Novo Tipo
        </Button>
      </div>

      <div className="h-px w-full bg-black/5 mb-6" />

      <div className="relative mb-6 max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Pesquisar..."
          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
        />
      </div>

      <DataTable columns={columnsType} data={mockTypes} />
    </main>
  )
}