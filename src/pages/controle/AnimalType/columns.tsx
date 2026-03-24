import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type AnimalType = {
  id: number
  label: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
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