import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "../data-table"
import { columnsAnimal } from "./columns"
import { useState } from "react"
import { Animal } from "@/types/schema/animal.schema"
import { useControlAnimal } from "@/stores/controle/animal-controll"
import AnimalForm from "../form/AnimalForm"
import { apiRequest } from "@/lib/api/request"
import { useQuery } from "@tanstack/react-query"

export default function AnimalPage() {
  const [filterValue, setFilterValue] = useState("")
  const { isEditing } = useControlAnimal()


  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['animals'],
    queryFn: () => apiRequest<Animal[]>({
      method: 'get',
      url: '/animal'
    })
  })


  const animals = response && !('error' in response || 'erros' in response) ? response.data : []

  if (isEditing) {
    return (
      <main className="p-6">
        <AnimalForm />
      </main>
    )
  }

  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Listagem de Animais</h1>

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

      {isLoading ? (
        <div className="p-10 text-center">Carregando lista de animais...</div>
      ) : isError ? (
        <div className="p-10 text-center text-red-500">Erro ao carregar animais.</div>
      ) : (
        <DataTable
          columns={columnsAnimal}
          data={animals}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
        />
      )}
    </main>
  )
}