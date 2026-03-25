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
import { useEffect, useState } from "react"
import { AnimalType, AnimalTypeUpdate } from "@/types/schema/animalType.schema"
import { apiRequest } from "@/lib/api/request"
import { toast } from "@/components/ui/sonner"
import { useQueryClient } from "@tanstack/react-query"

export default function AnimalTypeForm() {
  const { editingAnimalType, clearEditing } = useControlAnimalType()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  if (!editingAnimalType) return null
  const animalType: AnimalType = editingAnimalType

  const [formData, setFormData] = useState<AnimalTypeUpdate>(() => ({
    label: animalType.label,
    active: animalType.active,
  }))

  useEffect(() => {
    setFormData({
      label: animalType.label,
      active: animalType.active,
    })
  }, [animalType.id])

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

  async function updateAnimalType() {
    if (isSubmitting) return
    setIsSubmitting(true)

    const payload: AnimalTypeUpdate = {
      label: formData.label?.trim() ? formData.label : undefined,
      active: formData.active,
    }

    const res = await apiRequest<AnimalType, AnimalTypeUpdate>({
      method: 'patch',
      url: `/animal-type/${animalType.id}`,
      data: payload,
    })

    if ('data' in res) {
      toast.success('Tipo de animal atualizado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['animal-types'] })
      clearEditing()
      setIsSubmitting(false)
      return
    }

    if ('error' in res) {
      toast.error(res.error.message)
    } else if ('errors' in res) {
      toast.error(res.errors[0]?.message ?? 'Erro ao atualizar tipo de animal')
    } else {
      toast.error('Erro ao atualizar tipo de animal')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Tipo</label>
          <Input
            value={formData.label ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
          />
        </div>

        {/* Situação */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Situação</label>
          <Select
            value={formData.active ? "true" : "false"}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, active: value === "true" }))}
          >
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
          onClick={updateAnimalType}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <Button variant="outline" onClick={clearEditing}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}