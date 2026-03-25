import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useControlAnimalType } from "@/stores/controle/animal-type"
import { apiRequest } from "@/lib/api/request"
import { toast } from "@/components/ui/sonner"
import { useQueryClient } from "@tanstack/react-query"

export type AnimalType = {
  id: number
  label: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

function ActionsCell({ type }: { type: AnimalType }) {
  const setEditingAnimalType = useControlAnimalType((state) => state.setEditingAnimalType)
  const queryClient = useQueryClient()

  async function toggleActive() {
    const res = await apiRequest<AnimalType, { active: boolean }>({
      method: 'patch',
      url: `/animal-type/${type.id}`,
      data: { active: !type.active },
    })

    if ('data' in res) {
      toast.success(!type.active ? 'Tipo ativado com sucesso!' : 'Tipo desativado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['animal-types'] })
      return
    }

    if ('error' in res) {
      toast.error(res.error.message)
    } else if ('errors' in res) {
      toast.error(res.errors[0]?.message ?? 'Erro ao alterar situação do tipo')
    } else {
      toast.error('Erro ao alterar situação do tipo')
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => setEditingAnimalType(type)}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-all">
        <Pencil size={16} />
      </button>

      <button
        onClick={toggleActive}
        className={`flex items-center justify-center w-9 h-9 rounded-md text-white transition-all ${type.active ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
      >
        X
      </button>
    </div>
  )
}

export const columnsType: ColumnDef<AnimalType>[] = [
  {
    accessorKey: "label", // Mudamos de 'name' para 'label' conforme seu Zod
    header: "Tipo",
  },
  {
    accessorKey: "active", // Mudamos de 'status' para 'active' (boolean)
    header: "Situação",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean
      return (
        <Badge
          className={
            active
              ? "bg-green-100 text-green-700 hover:bg-green-200 border-none"
              : "bg-red-100 text-red-700 hover:bg-red-200 border-none"
          }
        >
          {active ? "ATIVO" : "INATIVO"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => {
      const type = row.original
      return <ActionsCell type={type} />
    },
  },
]