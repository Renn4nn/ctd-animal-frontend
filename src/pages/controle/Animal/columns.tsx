import { ColumnDef } from "@tanstack/react-table"
import { Pencil, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Animal } from "@/types/schema/animal.schema"
import type { AnimalType } from "@/types/schema/animalType.schema"
import { useControlAnimal } from "@/stores/controle/animal-controll"
import { apiRequest } from "@/lib/api/request"
import { toast } from "@/components/ui/sonner"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function TypeCell({ typeId }: { typeId: number }) {
  const { data: typeRes } = useQuery({
    queryKey: ['animal-types'],
    queryFn: () => apiRequest<AnimalType[]>({ method: 'get', url: '/animal-type' }),
  })

  const animalTypes = useMemo(() => {
    if (!typeRes || !('data' in typeRes)) return []
    return typeRes.data
  }, [typeRes])

  const typeLabel = animalTypes.find((t) => t.id === typeId)?.label || "-"

  return <span>{typeLabel}</span>
}

function ActionsCell({ animal }: { animal: Animal }) {
  const setEditingAnimal = useControlAnimal((state) => state.setEditingAnimal)
  const queryClient = useQueryClient()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const isAdopted = animal.status === "Adotado"

  async function confirmDelete() {
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
        disabled={isAdopted}
        onClick={() => setEditingAnimal(animal)}
        title={isAdopted ? "Animais adotados não podem ser editados" : "Editar animal"}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-amber-500 text-white transition-all hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
      >
        <Pencil size={16} />
      </button>
      <button
        disabled={isAdopted}
        onClick={() => setIsAlertOpen(true)}
        title={isAdopted ? "Animais adotados não podem ser excluídos" : "Excluir animal"}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-red-500 text-white transition-all hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-red-600"
      >
        <span className="font-bold">X</span>
      </button>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              animal <strong>{animal.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
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
    accessorKey: "typeId",
    header: "Tipo",
    cell: ({ row }) => {
      const typeId = row.getValue("typeId") as number
      return <TypeCell typeId={typeId} />
    },
  },
  {
    accessorKey: "sex",
    header: "Sexo",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-black transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown size={14} />
        </button>
      )
    },
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