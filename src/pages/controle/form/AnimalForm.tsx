import { useControlAnimal } from "@/stores/controle/animal-controll"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Animal } from "@/types/schema/animal.schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function AnimalForm() {
  const { editingAnimal, clearEditing } = useControlAnimal()

  if (!editingAnimal) return null
  const animal: Animal = editingAnimal


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
        {/* Nome */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nome</label>
          <Input defaultValue={animal.name} />
        </div>

        {/* Raça */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Raça</label>
          <Input defaultValue={animal.breed} />
        </div>

        {/* Sexo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Sexo</label>
          <Select defaultValue={animal.sex}>
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
          <Select defaultValue={animal.size}>
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
          <Input defaultValue={animal.age} />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Select defaultValue={animal.status}>
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
          <Textarea defaultValue={animal.description ?? ""} />
        </div>

        {/* História - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">História</label>
          <Textarea defaultValue={animal.story ?? ""} />
        </div>

        {/* Comportamento - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Comportamento</label>
          <Input defaultValue={animal.behavior ?? ""} />
        </div>

        <div className="pt-8 md:col-span-2 space-x-8">
          <label className="text-sm font-medium text-slate-700">Data de Criação: {formatDate(animal.createdAt)}</label>
          <label className="text-sm font-medium text-slate-700">Ultima atualização: {formatDate(animal.updatedAt)}</label>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-4 border-t">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            // Lógica de update aqui
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