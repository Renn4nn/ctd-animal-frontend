import { useControlAnimal } from "@/stores/controle/animal-controll"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Animal, AnimalUpdate } from "@/types/schema/animal.schema"
import type { AnimalType } from "@/types/schema/animalType.schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { apiRequest } from "@/lib/api/request"
import { Trash2, RotateCcw, UploadCloud } from "lucide-react"

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

const getPhotoUrl = (photo: string): string => {
  if (!photo) return "https://www.freeiconspng.com/uploads/no-image-icon-4.png";
  if (photo.includes("photos/animals")) {
    const uuid = photo.split("/").pop();
    if (uuid) {
      return `${import.meta.env.VITE_API_BASE_URL || import.meta.env.API_BASE_URL || "http://localhost:3002"}/uploads/${uuid}`;
    }
  }
  return photo;
};
import { toast } from "@/components/ui/sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function AnimalForm() {
  const { editingAnimal, clearEditing } = useControlAnimal()
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

  if (!editingAnimal) return null
  const animal: Animal = editingAnimal

  const [formData, setFormData] = useState<AnimalUpdate>(() => ({
    name: animal.name,
    typeId: animal.typeId,
    breed: animal.breed,
    sex: animal.sex,
    size: animal.size,
    age: animal.age,
    status: "Disponivel",
    description: animal.description,
    story: animal.story,
    behavior: animal.behavior,
    vaccines: animal.vaccines ?? [],
  }))

  const [vaccinesText, setVaccinesText] = useState(() => (animal.vaccines ?? []).join(', '))
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    setFormData({
      name: animal.name,
      typeId: animal.typeId,
      breed: animal.breed,
      sex: animal.sex,
      size: animal.size,
      age: animal.age,
      status: "Disponivel",
      description: animal.description,
      story: animal.story,
      behavior: animal.behavior,
      vaccines: animal.vaccines ?? [],
    })
    setVaccinesText((animal.vaccines ?? []).join(', '))
    setRemovedPhotos([])
    setFiles([])
  }, [animal.id])

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
      if (newFiles.length + (animal.photos?.length ?? 0) - removedPhotos.length > 20) {
        toast.error("Você só pode ter até 20 imagens no total.");
        return prev;
      }
      return newFiles;
    });

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const fieldClassName = "bg-white placeholder:text-gray"

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

    const vaccines = vaccinesText.split(',').map((v) => v.trim()).filter(Boolean)
    const existingPhotos = animal.photos ? animal.photos.filter(p => !removedPhotos.includes(p)) : []

    const fd = new FormData()
    fd.append('name', formData.name ?? "")
    fd.append('typeId', String(formData.typeId))
    fd.append('breed', formData.breed ?? "")
    fd.append('age', formData.age ?? "")
    fd.append('size', formData.size ?? "Pequeno")
    fd.append('sex', formData.sex ?? "Macho")
    fd.append('status', formData.status ?? "Disponivel")
    fd.append('description', formData.description ?? "")
    fd.append('story', formData.story ?? "")
    fd.append('behavior', formData.behavior ?? "")
    fd.append('vaccines', JSON.stringify(vaccines))
    fd.append('photos', JSON.stringify(existingPhotos))

    for (const file of files) {
      fd.append('files', file)
    }

    const res = await apiRequest<Animal, FormData>({
      method: 'patch',
      url: `/animal/${animal.id}`,
      data: fd,
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
          <label className="text-sm font-medium text-slate-700">Nome <span className="text-red-500">*</span></label>
          <Input
            className={fieldClassName}
            value={formData.name ?? ""}
            placeholder="Ex: Rex"
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Tipo */}
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
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Raça */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Raça <span className="text-red-500">*</span></label>
          <Input
            className={fieldClassName}
            value={formData.breed ?? ""}
            placeholder="Ex: Golden Retriever"
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
            <SelectTrigger className={fieldClassName}>
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

        {/* Idade */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Idade <span className="text-red-500">*</span></label>
          <Input
            className={fieldClassName}
            value={formData.age ?? ""}
            placeholder="Ex: 2 anos"
            onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
          />
        </div>

        {/* Vacinas */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Vacinas (separe por vírgula)</label>
          <Input
            className={fieldClassName}
            value={vaccinesText}
            placeholder="Ex: V8, Antirrábica"
            onChange={(e) => setVaccinesText(e.target.value)}
          />
        </div>

        {/* Descrição - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Descrição</label>
          <Textarea
            className={fieldClassName}
            value={formData.description ?? ""}
            placeholder="Descreva o animal..."
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {/* História - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">História</label>
          <Textarea
            className={fieldClassName}
            value={formData.story ?? ""}
            placeholder="Conte a história do animal..."
            onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
          />
        </div>

        {/* Comportamento - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Comportamento</label>
          <Input
            className={fieldClassName}
            value={formData.behavior ?? ""}
            placeholder="Ex: Dócil, sociável com crianças"
            onChange={(e) => setFormData((prev) => ({ ...prev, behavior: e.target.value }))}
          />
        </div>

        {/* Fotos Existentes */}
        {animal.photos && animal.photos.length > 0 && (
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Fotos Salvas</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs font-semibold"
                onClick={() => {
                  if (removedPhotos.length === animal.photos!.length) {
                    setRemovedPhotos([]);
                  } else {
                    setRemovedPhotos([...animal.photos!]);
                  }
                }}
              >
                {removedPhotos.length === animal.photos!.length ? 'Restaurar Todas' : 'Excluir Todas'}
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              {animal.photos.map((photo, idx) => {
                const isRemoved = removedPhotos.includes(photo);
                return (
                  <div key={idx} className={`relative h-24 w-24 rounded-md overflow-hidden border border-border group transition-all duration-300 ${isRemoved ? 'opacity-50 grayscale scale-[0.98]' : ''}`}>
                    <img
                      src={getPhotoUrl(photo)}
                      alt={`Foto salva ${idx}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (isRemoved) {
                          setRemovedPhotos(prev => prev.filter(p => p !== photo));
                        } else {
                          setRemovedPhotos(prev => [...prev, photo]);
                        }
                      }}
                      className={`absolute top-1 right-1 text-white rounded-full p-1.5 leading-none shadow transition-colors ${isRemoved ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500/80 hover:bg-red-600'}`}
                      title={isRemoved ? "Restaurar" : "Remover"}
                    >
                      {isRemoved ? <RotateCcw size={14} /> : <Trash2 size={14} />}
                    </button>
                    {isRemoved && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-[10px] uppercase font-bold tracking-widest pointer-events-none rounded-md">
                        Excluída
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4 md:col-span-2 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Adicionar Novas Fotos Locais (Total de até 20 fotos)
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

        <div className="pt-8 md:col-span-2 space-x-8">
          <label className="text-sm font-medium text-slate-700">Data de Criação: {formatDate(animal.createdAt)}</label>
          <label className="text-sm font-medium text-slate-700">Ultima atualização: {formatDate(animal.updatedAt)}</label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={updateAnimal}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <Button variant="outline" onClick={clearEditing}>Cancelar</Button>
      </div>
    </div>
  )
}