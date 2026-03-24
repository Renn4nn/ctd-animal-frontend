import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type Animal = {
  id: string
  name: string
  breed: string
  sex: "Macho" | "Fêmea"
  status: "Adotado" | "Disponível"
  typeId?: number
  age?: string
  vaccines?: string[]
  size?: string
  description?: string | null
  behavior?: string | null
  story?: string | null
  photos?: unknown[]
  createdAt?: Date
  updatedAt?: Date
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
            status === "Disponível"
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
      return (
        <div className="flex items-center justify-end gap-2">
          <button className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all">
            <Pencil size={16} />
          </button>
          <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  },
]