import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type Animal = {
  id: string
  name: string
  status: "ADOTADO" | "DISPONIVEL"
}

export const columns: ColumnDef<Animal>[] = [
  {
    accessorKey: "name",
    header: "Animal",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          className={
            status === "DISPONIVEL"
              ? "bg-green-100 text-green-700 hover:bg-green-200 border-none px-3"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3"
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
          <button
            onClick={() => console.log("Editar", animal.id)}
            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => console.log("Excluir", animal.id)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  },
]