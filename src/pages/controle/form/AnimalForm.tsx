import { useControlAnimal } from "@/stores/controle/animal-controll"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Animal, AnimalUpdate } from "@/types/schema/animal.schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api/request"
import { toast } from "@/components/ui/sonner"
import { useQueryClient } from "@tanstack/react-query"

export default function AnimalForm() {
  const { editingAnimal, clearEditing } = useControlAnimal()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  if (!editingAnimal) return null
  const animal: Animal = editingAnimal

  const [formData, setFormData] = useState<AnimalUpdate>(() => ({
    name: animal.name,
    breed: animal.breed,
    sex: animal.sex,
    size: animal.size,
    age: animal.age,
    status: animal.status,
    description: animal.description,
    story: animal.story,
    behavior: animal.behavior,
  }))

  useEffect(() => {
    setFormData({
      name: animal.name,
      breed: animal.breed,
      sex: animal.sex,
      size: animal.size,
      age: animal.age,
      status: animal.status,
      description: animal.description,
      story: animal.story,
      behavior: animal.behavior,
    })
  }, [animal.id])

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

  async function updateAnimal() {
    if (isSubmitting) return
    setIsSubmitting(true)

    const payload: AnimalUpdate = {
      ...formData,
      description: formData.description?.trim() ? formData.description : null,
      story: formData.story?.trim() ? formData.story : null,
      behavior: formData.behavior?.trim() ? formData.behavior : null,
    }

    const res = await apiRequest<Animal, AnimalUpdate>({
      method: 'patch',
      url: `/animal/${animal.id}`,
      data: payload,
    })

    if ('data' in res) {
      toast.success('Animal atualizado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['animals'] })
      clearEditing()
      setIsSubmitting(false)
      return
    }

    if ('error' in res) {
      toast.error(res.error.message)
    } else if ('errors' in res) {
      toast.error(res.errors[0]?.message ?? 'Erro ao atualizar animal')
    } else {
      toast.error('Erro ao atualizar animal')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nome</label>
          <Input
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Raça */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Raça</label>
          <Input
            value={formData.breed ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, breed: e.target.value }))}
          />
        </div>

        {/* Sexo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Sexo</label>
          <Select
            value={formData.sex}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value as Animal['sex'] }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o sexo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Femea">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Porte */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Porte</label>
          <Select
            value={formData.size}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, size: value as Animal['size'] }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o porte" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Pequeno">Pequeno</SelectItem>
              <SelectItem value="Medio">Médio</SelectItem>
              <SelectItem value="Grande">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Idade */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Idade</label>
          <Input
            value={formData.age ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as Animal['status'] }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Disponivel">Disponível</SelectItem>
              <SelectItem value="Adotado">Adotado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Descrição - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Descrição</label>
          <Textarea
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {/* História - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">História</label>
          <Textarea
            value={formData.story ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
          />
        </div>

        {/* Comportamento - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Comportamento</label>
          <Input
            value={formData.behavior ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, behavior: e.target.value }))}
          />
        </div>

        <div className="pt-8 md:col-span-2 space-x-8">
          <label className="text-sm font-medium text-slate-700">Data de Criação: {formatDate(animal.createdAt)}</label>
          <label className="text-sm font-medium text-slate-700">Ultima atualização: {formatDate(animal.updatedAt)}</label>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-4 border-t">
        <Button
          className="bg-blue-600 hover:bg-blue-700 min-w-[140px]"
          onClick={updateAnimal}
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