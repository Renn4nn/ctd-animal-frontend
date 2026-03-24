import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type AnimalType = {
  id: string
  name: string
  status: "ATIVO" | "INATIVO"
}

export const columnsType: ColumnDef<AnimalType>[] = [
  {
    accessorKey: "name",
    header: "Tipo de Animal",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          className={
            status === "ATIVO"
              ? "bg-green-100 text-green-700 hover:bg-green-200 border-none px-3"
              : "bg-red-100 text-red-700 hover:bg-red-200 border-none px-3"
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
      const type = row.original
      return (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => console.log("Editar Tipo", type.id)}
            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => console.log("Excluir Tipo", type.id)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  },
]