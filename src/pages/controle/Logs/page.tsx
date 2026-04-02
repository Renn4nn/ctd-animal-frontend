import { useState } from "react"
import { AnimalType } from "@/types/schema/animalType.schema"
import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api/request"
import { AdptionLog } from "@/types/schema/adptionLog.schema"
import { DataTable } from "../data-table"
import { columnsLogs } from "./columns"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Animal } from "@/types/schema/animal.schema"
import { format } from "date-fns"
import { toast } from "sonner"
import { PageTitle } from "@/components/page-title"

export default function Logs() {
  const [filterValue, setFilterValue] = useState("")

  const { data: animalsData } = useQuery({
    queryKey: ["animals"],
    queryFn: async () => {
      const response = await apiRequest<{ data: Animal[] }, never>({
        method: "get",
        url: `/animal`,
      })
      return response
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adption-logs"],
    queryFn: async () => {
      const response = await apiRequest<{ data: AdptionLog[] }, never>({
        method: "get",
        url: `/adption-log`,
      })
      return response
    },
  })

  const { data: animalTypesData } = useQuery({
    queryKey: ["animal-types"],
    queryFn: async () => {
      const response = await apiRequest<{ data: AnimalType[] }, never>({
        method: "get",
        url: `/animal-type`,
      })
      return response
    },
  })

  // fallback seguro
  const animals = animalsData?.data ?? []
  const animalTypes = animalTypesData?.data ?? []
  const logs = data?.data ?? []

  const getAnimalTypeLabel = (typeId: number | undefined) => {
    if (!typeId) return "N/A"
    const type = animalTypes.find((t) => t.id === typeId)
    return type?.label || "N/A"
  }

  const logsWithAnimals = logs.map((log) => {
    const animalInfo = animals.find((a) => a.id === log.animalId)

    return {
      ...log,
      animal: animalInfo,
      animalTypeLabel: animalInfo
        ? getAnimalTypeLabel(animalInfo.typeId)
        : "N/A",
    }
  })

  function convertJSONToCSV(jsonData: any[]) {
    if (!jsonData || jsonData.length === 0) return ""

    const headers = [
      "Adotante",
      "CPF",
      "Telefone",
      "Email",
      "Animal - Nome",
      "Animal - Tipo",
      "Animal - Raca",
      "Animal - Idade",
      "Animal - Sexo",
      "Animal - Porte",
      "Animal - Status",
      "Data",
    ]

    const rows = jsonData.map((log) => {
      const animal = log.animal || {}

      const columns = [
        log.adopterName,
        log.adopterCpf,
        log.adopterPhone,
        log.adopterEmail,
        animal.name || "N/A",
        log.animalTypeLabel || "N/A",
        animal.breed || "N/A",
        animal.age || "N/A",
        animal.sex || "N/A",
        animal.size || "N/A",
        animal.status || "N/A",
        log.adoptedAt
          ? format(new Date(log.adoptedAt), "dd/MM/yyyy HH:mm")
          : "N/A",
      ]

      return columns
        .map((value) => {
          const stringValue = String(value || "").replace(/"/g, '""')
          return `"${stringValue}"`
        })
        .join(";")
    })

    return [headers.join(";"), ...rows].join("\n")
  }

  function downloadCSV(jsonData: any[]) {
    if (!jsonData || jsonData.length === 0) {
      toast.error("Não há dados disponíveis para exportar no momento.")
      return
    }

    const csvData = convertJSONToCSV(jsonData)

    if (!csvData) {
      toast.error("Não há dados para exportar")
      return
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.setAttribute(
      "download",
      `relatorio_adocoes_${format(new Date(), "dd-MM-yyyy")}.csv`
    )

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const hasError = isError

  return (
    <main>
      <PageTitle title="Relatórios" />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Relatórios de Adoção</h1>

        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-blue-200 transition-all active:scale-95"
          onClick={() => downloadCSV(logsWithAnimals)}
        >
          <Download size={20} />
          Exportar para CSV
        </Button>
      </div>

      <div className="h-px w-full bg-black/5 mb-6" />

      <div className="relative mb-6 max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />

        <Input
          placeholder="Filtrar relatorios..."
          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-slate-500">
          Carregando lista de logs...
        </div>
      ) : hasError ? (
        <div className="p-10 text-center text-slate-500">
          Nenhum dado disponível.
        </div>
      ) : logsWithAnimals.length === 0 ? (
        <div className="p-10 text-center text-slate-500">
          Nenhum log encontrado.
        </div>
      ) : (
        <DataTable
          columns={columnsLogs}
          data={logsWithAnimals}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
        />
      )}
    </main>
  )
}