import { ColumnDef } from "@tanstack/react-table"
import { AdptionLog } from "@/types/schema/adptionLog.schema"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AnimalCell } from "./AnimalCell"

export const columnsLogs: ColumnDef<AdptionLog>[] = [
  {
    accessorKey: "adopterName",
    header: "Adotante",
    cell: ({ row }) => <span className="font-medium">{row.original.adopterName}</span>,
  },
  {
    accessorKey: "adopterCpf",
    header: "CPF",
    cell: ({ row }) => {
      const cpf = row.original.adopterCpf
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
  },
  {
    accessorKey: "adopterPhone",
    header: "Telefone",
  },
  {
    accessorKey: "adopterEmail",
    header: "Email",
  },
  {
    accessorKey: "animalId",
    header: "Animal Adotado",
    cell: ({ row }) => (
      <AnimalCell animalId={row.original.animalId} />
    ),
  },
  {
    accessorKey: "adoptedAt",
    header: "Data da Adoção",
    cell: ({ row }) => {
      return format(new Date(row.original.adoptedAt), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    },
  },
]