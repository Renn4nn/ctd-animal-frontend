import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Animal } from "@/types/schema/animal.schema"
import { useControlAnimal } from "@/stores/controle/animal-controll"
import { apiRequest } from "@/lib/api/request"
import { toast } from "@/components/ui/sonner"
import { useQueryClient } from "@tanstack/react-query"

function ActionsCell({ animal }: { animal: Animal }) {
  const setEditingAnimal = useControlAnimal((state) => state.setEditingAnimal)
  const queryClient = useQueryClient()

  async function deleteAnimal() {
    const confirmed = window.confirm(`Tem certeza que deseja excluir ${animal.name}?`)
    if (!confirmed) return

    const res = await apiRequest<Animal, never>({
      method: 'delete',
      url: `/animal/${animal.id}`,
    })

    if ('data' in res) {
      toast.success('Animal excluído com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['animals'] })
      return
    }

    if ('error' in res) {
      toast.error(res.error.message)
    } else if ('errors' in res) {
      toast.error(res.errors[0]?.message ?? 'Erro ao excluir animal')
    } else {
      toast.error('Erro ao excluir animal')
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => setEditingAnimal(animal)}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-all">
        <Pencil size={16} />
      </button>

      <button
        onClick={deleteAnimal}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-red-500 text-white hover:bg-red-600 transition-all"
      >
        X
      </button>
    </div>
  )
}

export const columnsAnimal: ColumnDef<Animal>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "breed",
    header: "Raça",
  },
  {
    accessorKey: "sex",
    header: "Sexo",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          className={
            status === "Disponivel"
              ? "bg-green-100 text-green-700 hover:bg-green-200 border-none"
              : "bg-red-100 text-red-700 hover:bg-red-200 border-none"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => {
      const animal = row.original
      return <ActionsCell animal={animal} />
    },
  },
]