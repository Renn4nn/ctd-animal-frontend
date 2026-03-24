import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"
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
          <button className="flex items-center justify-center w-9 h-9 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-all">
            <Pencil size={16} />
          </button>

          <button className="flex items-center justify-center w-9 h-9 rounded-md bg-red-500 text-white hover:bg-red-600 transition-all">
            X
          </button>
        </div>
      )
    },
  },
]