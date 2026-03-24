import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
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
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-none"
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