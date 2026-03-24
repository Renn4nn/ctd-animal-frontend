import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "../data-table"
import { columns, Animal } from "./columns"

const data: Animal[] = [
  { id: "1", name: "Rex", status: "DISPONIVEL" },
  { id: "2", name: "Bobby", status: "DISPONIVEL" },
  { id: "3", name: "Kiosk", status: "ADOTADO" },
]

export default function AnimalPage() {
  return (
    <main>
      {/* Topo Dinâmico */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Listagem dos Animais
        </h1>

        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} />
          Novo Animal
        </Button>
      </div>

      <div className="h-px w-full bg-black/5 mb-6" />

      {/* Campo de Busca */}
      <div className="relative mb-6 max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Pesquisar..."
          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
        />
      </div>

      {/* Tabela do React Table */}
      <DataTable columns={columns} data={data} />
    </main>
  )
}