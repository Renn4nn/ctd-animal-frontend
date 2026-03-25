import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { apiRequest } from "@/lib/api/request"
import { toast } from "@/components/ui/sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Animal, AnimalCreate } from "@/types/schema/animal.schema"
import type { AnimalType } from "@/types/schema/animalType.schema"

type PhotoLink = { id: string; url: string }

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function AnimalCreateForm({ onCancel }: { onCancel: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const { data: typeRes } = useQuery({
    queryKey: ['animal-types'],
    queryFn: () => apiRequest<AnimalType[]>({ method: 'get', url: '/animal-type' }),
  })

  const animalTypes = useMemo(() => {
    if (!typeRes || !('data' in typeRes)) return []
    return typeRes.data
  }, [typeRes])

  const [formData, setFormData] = useState<AnimalCreate>(() => ({
    name: "",
    typeId: 0,
    breed: "",
    age: "",
    description: null,
    story: null,
    behavior: null,
    vaccines: [],
    size: "Pequeno",
    sex: "Macho",
    photos: [],
    status: "Disponivel",
  }))

  const [vaccinesText, setVaccinesText] = useState("")
  const [photoLinks, setPhotoLinks] = useState<PhotoLink[]>([{ id: makeId(), url: "" }])
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    if (formData.typeId !== 0) return
    if (animalTypes.length === 0) return
    setFormData((prev) => ({ ...prev, typeId: animalTypes[0]!.id }))
  }, [animalTypes, formData.typeId])

  function updatePhotoLink(id: string, url: string) {
    setPhotoLinks((prev) => prev.map((p) => (p.id === id ? { ...p, url } : p)))
  }

  function addPhotoLink() {
    setPhotoLinks((prev) => [...prev, { id: makeId(), url: "" }])
  }

  function removePhotoLink(id: string) {
    setPhotoLinks((prev) => (prev.length <= 1 ? prev : prev.filter((p) => p.id !== id)))
  }

  async function createAnimal() {
    if (isSubmitting) return
    setIsSubmitting(true)

    const vaccines = vaccinesText
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

    const photos = photoLinks
      .map((p) => p.url.trim())
      .filter(Boolean)

    const fd = new FormData()

    fd.append('name', formData.name)
    fd.append('typeId', String(formData.typeId))
    fd.append('breed', formData.breed)
    fd.append('age', formData.age)
    fd.append('size', formData.size)
    fd.append('sex', formData.sex)
    fd.append('status', formData.status)

    fd.append('description', formData.description ?? "")
    fd.append('story', formData.story ?? "")
    fd.append('behavior', formData.behavior ?? "")

    fd.append('vaccines', JSON.stringify(vaccines))
    fd.append('photos', JSON.stringify(photos))

    for (const file of files) {
      fd.append('files', file)
    }

    const res = await apiRequest<Animal, FormData>({
      method: 'post',
      url: '/animal',
      data: fd,
    })

    if ('data' in res) {
      toast.success('Animal criado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['animals'] })
      onCancel()
      setIsSubmitting(false)
      return
    }

    if ('error' in res) {
      toast.error(res.error.message)
    } else if ('errors' in res) {
      toast.error(res.errors[0]?.message ?? 'Erro ao criar animal')
    } else {
      toast.error('Erro ao criar animal')
    }

    setIsSubmitting(false)
  }

  const canSubmit =
    !!formData.name.trim() &&
    !!formData.breed.trim() &&
    !!formData.age.trim() &&
    !!formData.typeId

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nome</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Tipo</label>
          <Select
            value={String(formData.typeId)}
            onValueChange={(value) => setFormData((p) => ({ ...p, typeId: Number(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {animalTypes.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Raça</label>
          <Input
            value={formData.breed}
            onChange={(e) => setFormData((p) => ({ ...p, breed: e.target.value }))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Idade</label>
          <Input
            value={formData.age}
            onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Sexo</label>
          <Select
            value={formData.sex}
            onValueChange={(value) => setFormData((p) => ({ ...p, sex: value as AnimalCreate['sex'] }))}
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

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Porte</label>
          <Select
            value={formData.size}
            onValueChange={(value) => setFormData((p) => ({ ...p, size: value as AnimalCreate['size'] }))}
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

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((p) => ({ ...p, status: value as AnimalCreate['status'] }))}
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

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Vacinas (separe por vírgula)</label>
          <Input value={vaccinesText} onChange={(e) => setVaccinesText(e.target.value)} />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Descrição</label>
          <Textarea
            value={formData.description ?? ""}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">História</label>
          <Textarea
            value={formData.story ?? ""}
            onChange={(e) => setFormData((p) => ({ ...p, story: e.target.value }))}
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Comportamento</label>
          <Input
            value={formData.behavior ?? ""}
            onChange={(e) => setFormData((p) => ({ ...p, behavior: e.target.value }))}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Fotos (links)</label>
          <div className="space-y-2">
            {photoLinks.map((p) => (
              <div key={p.id} className="flex gap-2">
                <Input
                  value={p.url}
                  placeholder="https://..."
                  onChange={(e) => updatePhotoLink(p.id, e.target.value)}
                />
                <Button variant="outline" onClick={() => removePhotoLink(p.id)} type="button">
                  -
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addPhotoLink} type="button">
              Adicionar link
            </Button>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Fotos (arquivos)</label>
          <Input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-4 border-t">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={createAnimal}
          disabled={isSubmitting || !canSubmit}
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
