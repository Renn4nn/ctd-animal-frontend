import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"

function FilePreview({ file, onRemove }: { file: File, onRemove: () => void }) {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative h-24 w-24 rounded-md overflow-hidden border border-border group">
      {preview && <img src={preview} alt="Preview" className="h-full w-full object-cover" />}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1.5 leading-none shadow hover:bg-red-600 backdrop-blur-sm transition-opacity"
        title="Remover"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  );
}

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

  // Estilo comum para os campos
  const fieldClassName = "bg-white placeholder:text-gray"

  useEffect(() => {
    if (formData.typeId !== 0) return
    if (animalTypes.length === 0) return
    setFormData((prev) => ({ ...prev, typeId: animalTypes[0]!.id }))
  }, [animalTypes, formData.typeId])

  function updatePhotoLink(id: string, url: string) {
    setPhotoLinks((prev) => prev.map((p) => (p.id === id ? { ...p, url } : p)))
  }

  function addPhotoLink() {
    const lastLink = photoLinks[photoLinks.length - 1]
    if (photoLinks.length >= 10) {
      toast.error("Máximo de 10 fotos por animal")
      return
    }
    if (!lastLink?.url.trim()) {
      toast.error("Preencha o link atual antes de adicionar um novo")
      return
    }
    setPhotoLinks((prev) => [...prev, { id: makeId(), url: "" }])
  }

  function removePhotoLink(id: string) {
    setPhotoLinks((prev) => (prev.length <= 1 ? prev : prev.filter((p) => p.id !== id)))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    const hasInvalidFile = selectedFiles.some(file => !acceptedTypes.includes(file.type));

    if (hasInvalidFile) {
      toast.error("Apenas imagens (PNG, JPEG, JPG, WEBP) são permitidas.");
      e.target.value = "";
      return;
    }

    setFiles(prev => {
      const newFiles = [...prev, ...selectedFiles];
      if (newFiles.length > 20) {
        toast.error("Você só pode selecionar até 20 imagens no total.");
        return prev;
      }
      return newFiles;
    });
    
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  async function createAnimal() {
    if (isSubmitting) return
    setIsSubmitting(true)

    const vaccines = vaccinesText.split(',').map((v) => v.trim()).filter(Boolean)
    const photos = photoLinks.map((p) => p.url.trim()).filter(Boolean)

    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('typeId', String(formData.typeId))
    fd.append('breed', formData.breed)
    fd.append('age', formData.age)
    fd.append('size', formData.size)
    fd.append('sex', formData.sex)
    fd.append('status', "Disponivel")
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

  const canSubmit = !!formData.name.trim() && !!formData.breed.trim() && !!formData.age.trim() && !!formData.typeId

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nome <span className="text-red-500">*</span></label>
          <Input
            className={fieldClassName}
            value={formData.name}
            placeholder="Ex: Rex"
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Tipo <span className="text-red-500">*</span></label>
          <Select
            value={String(formData.typeId)}
            onValueChange={(value) => setFormData((p) => ({ ...p, typeId: Number(value) }))}
          >
            <SelectTrigger className={fieldClassName}>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {animalTypes.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Raça <span className="text-red-500">*</span></label>
          <Input
            className={fieldClassName}
            value={formData.breed}
            placeholder="Ex: Golden Retriever"
            onChange={(e) => setFormData((p) => ({ ...p, breed: e.target.value }))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Idade <span className="text-red-500">*</span></label>
          <Input
            className={fieldClassName}
            value={formData.age}
            placeholder="Ex: 2 anos"
            onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Sexo</label>
          <Select
            value={formData.sex}
            onValueChange={(value) => setFormData((p) => ({ ...p, sex: value as AnimalCreate['sex'] }))}
          >
            <SelectTrigger className={fieldClassName}>
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
            <SelectTrigger className={fieldClassName}>
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
          <label className="text-sm font-medium text-slate-700">Vacinas (separe por vírgula)</label>
          <Input
            className={fieldClassName}
            value={vaccinesText}
            placeholder="Ex: V8, Antirrábica"
            onChange={(e) => setVaccinesText(e.target.value)}
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Descrição</label>
          <Textarea
            className={fieldClassName}
            value={formData.description ?? ""}
            placeholder="Descreva o animal..."
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">História</label>
          <Textarea
            className={fieldClassName}
            value={formData.story ?? ""}
            placeholder="Conte a história do animal..."
            onChange={(e) => setFormData((p) => ({ ...p, story: e.target.value }))}
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Comportamento</label>
          <Input
            className={fieldClassName}
            value={formData.behavior ?? ""}
            placeholder="Ex: Dócil, sociável com crianças"
            onChange={(e) => setFormData((p) => ({ ...p, behavior: e.target.value }))}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Fotos (links)</label>
          <div className="space-y-2">
            {photoLinks.map((p) => (
              <div key={p.id} className="flex gap-2">
                <Input
                  className={fieldClassName}
                  value={p.url}
                  placeholder="https://..."
                  onChange={(e) => updatePhotoLink(p.id, e.target.value)}
                />
                <Button variant="outline" onClick={() => removePhotoLink(p.id)} type="button">-</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addPhotoLink} type="button">Adicionar link</Button>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Fotos Locais (Até 20 fotos)
            </label>
            <label 
              htmlFor="photo-input"
              className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group text-center"
            >
              <input
                id="photo-input"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform mb-3 shadow-sm">
                <UploadCloud className="size-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Clique ou arraste suas imagens aqui
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Suporta PNG, JPEG, WEBP (Máx. 20 Arquivos)
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-3 p-3 bg-slate-50 border border-border rounded-lg">
              {files.map((file, idx) => (
                <FilePreview key={`${file.name}-${idx}`} file={file} onRemove={() => removeFile(idx)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={createAnimal}
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Salvando..." : "Criar Animal"}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  )
}