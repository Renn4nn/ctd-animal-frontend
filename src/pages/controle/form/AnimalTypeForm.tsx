import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useControlAnimalType } from "@/stores/controle/animal-type"

export default function AnimalTypeForm() {
  const { editingAnimalType, clearEditing } = useControlAnimalType()

  if (!editingAnimalType) return null
  const animalType = editingAnimalType


  const formatDate = (date?: string | Date) => {
    if (!date) return ""

    const d = typeof date === "string" ? new Date(date) : date

    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Tipo</label>
          <Input defaultValue={animalType.label} />
        </div>


        {/* Situação */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Situação</label>
          <Select defaultValue={animalType.active ? "true" : "false"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">ATIVO</SelectItem>
              <SelectItem value="false">INATIVO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-8 md:col-span-2 space-x-8">
          <label className="text-sm font-medium text-slate-700">Data de Criação: {formatDate(animalType.createdAt)}</label>
          <label className="text-sm font-medium text-slate-700">Ultima atualização: {formatDate(animalType.updatedAt)}</label>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-4 border-t">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            clearEditing()
          }}
        >
          Salvar Alterações
        </Button>
        <Button variant="outline" onClick={clearEditing}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}