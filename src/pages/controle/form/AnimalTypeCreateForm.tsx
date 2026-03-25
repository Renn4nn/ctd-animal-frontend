import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { apiRequest } from "@/lib/api/request"
import { toast } from "@/components/ui/sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { AnimalType, AnimalTypeCreate } from "@/types/schema/animalType.schema"

export default function AnimalTypeCreateForm({
  onCancel,
}: {
  onCancel: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [label, setLabel] = useState("")
  const queryClient = useQueryClient()

  async function createAnimalType() {
    if (isSubmitting) return
    setIsSubmitting(true)

    const payload: AnimalTypeCreate = {
      label: label.trim(),
    }

    const res = await apiRequest<AnimalType, AnimalTypeCreate>({
      method: 'post',
      url: '/animal-type',
      data: payload,
    })

    if ('data' in res) {
      toast.success('Tipo de animal criado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['animal-types'] })
      onCancel()
      setIsSubmitting(false)
      return
    }

    if ('error' in res) {
      toast.error(res.error.message)
    } else if ('errors' in res) {
      toast.error(res.errors[0]?.message ?? 'Erro ao criar tipo de animal')
    } else {
      toast.error('Erro ao criar tipo de animal')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Tipo</label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-4 border-t">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={createAnimalType}
          disabled={isSubmitting || !label.trim()}
        >
          {isSubmitting ? "Salvando..." : "Criar"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
