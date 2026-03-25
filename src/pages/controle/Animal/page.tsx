import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "../data-table"
import { columnsAnimal } from "./columns"
import { useState } from "react"
import { Animal } from "@/types/schema/animal.schema"
import { useControlAnimal } from "@/stores/controle/animal-controll"
import AnimalForm from "../form/AnimalForm"

const data: Animal[] = [
  {
    id: "1",
    name: "Rex",
    status: "Disponivel",
    breed: "Vira-lata",
    sex: "Macho",
    typeId: 1,
    age: "2 anos",
    vaccines: ["Raiva", "V8"],
    size: "Medio",
    description: "Muito fofo e cheio de energia.",
    behavior: "Dócil, brincalhão e sociável com outros cães.",
    story: "Abandonado em um beco e resgatado por voluntários.",
    photos: ["https://example.com/rex1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Bobby",
    status: "Disponivel",
    breed: "Poodle",
    sex: "Macho",
    typeId: 1,
    age: "1 ano",
    vaccines: ["V8"],
    size: "Pequeno",
    description: "Pequeno, elegante e muito apegado.",
    behavior: "Carinhoso e um pouco tímido com estranhos.",
    story: "Entregue por uma família que não podia mais cuidar.",
    photos: ["https://example.com/bobby1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Kiosk",
    status: "Adotado",
    breed: "Siamês",
    sex: "Femea",
    typeId: 2,
    age: "3 anos",
    vaccines: ["V4", "Raiva"],
    size: "Pequeno",
    description: "Gata elegante e independente.",
    behavior: "Tranquila, gosta de observar o ambiente.",
    story: "Resgatada de uma colônia de gatos de rua.",
    photos: ["https://example.com/kiosk1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Luna",
    status: "Disponivel",
    breed: "Labrador",
    sex: "Femea",
    typeId: 1,
    age: "4 anos",
    vaccines: ["Raiva", "Leptospirose", "V10"],
    size: "Grande",
    description: "Carinhosa e extremamente brincalhona.",
    behavior: "Amigável, ótima com crianças e outros animais.",
    story: "Encontrada abandonada em um parque.",
    photos: ["https://example.com/luna1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // NOVOS DADOS 👇

  {
    id: "5",
    name: "Mingau",
    status: "Disponivel",
    breed: "Persa",
    sex: "Macho",
    typeId: 2,
    age: "6 anos",
    vaccines: ["V4"],
    size: "Pequeno",
    description: "Gato calmo, ideal para apartamentos.",
    behavior: "Preguiçoso, adora colo e lugares quentinhos.",
    story: "Foi encontrado perdido e nunca localizaram o dono.",
    photos: ["https://example.com/mingau1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    name: "Spike",
    status: "Disponivel",
    breed: "Pitbull",
    sex: "Macho",
    typeId: 1,
    age: "3 anos",
    vaccines: ["Raiva", "V10"],
    size: "Medio",
    description: "Forte e leal, com olhar intimidador mas coração doce.",
    behavior: "Protetor, obediente e muito apegado ao tutor.",
    story: "Resgatado de maus-tratos e reabilitado.",
    photos: ["https://example.com/spike1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "7",
    name: "Mel",
    status: "Adotado",
    breed: "Golden Retriever",
    sex: "Femea",
    typeId: 1,
    age: "2 anos",
    vaccines: ["Raiva", "V10"],
    size: "Grande",
    description: "Extremamente dócil e amorosa.",
    behavior: "Brincalhona, perfeita para famílias.",
    story: "Doada por um criador responsável.",
    photos: ["https://example.com/mel1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "8",
    name: "Nina",
    status: "Disponivel",
    breed: "Vira-lata",
    sex: "Femea",
    typeId: 2,
    age: "8 meses",
    vaccines: ["V4"],
    size: "Pequeno",
    description: "Filhote curiosa e cheia de energia.",
    behavior: "Brincalhona, se adapta fácil.",
    story: "Encontrada em uma caixa na rua ainda filhote.",
    photos: ["https://example.com/nina1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "9",
    name: "Zeus",
    status: "Disponivel",
    breed: "Rottweiler",
    sex: "Macho",
    typeId: 1,
    age: "5 anos",
    vaccines: ["Raiva", "V10"],
    size: "Grande",
    description: "Imponente e muito protetor.",
    behavior: "Leal, precisa de tutor experiente.",
    story: "Seu dono faleceu e ele ficou sem lar.",
    photos: ["https://example.com/zeus1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function AnimalPage() {
  const [filterValue, setFilterValue] = useState("")
  const { isEditing } = useControlAnimal()


  if (isEditing) {
    return (
      <main className="p-6">
        <AnimalForm />
      </main>
    )
  }

  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Listagem de Animais
        </h1>

        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} />
          Novo
        </Button>
      </div>

      <div className="h-px w-full bg-black/5 mb-6" />

      <div className="relative mb-6 max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Pesquisar por nome ou raça..."
          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      <DataTable columns={columnsAnimal} data={data} filterValue={filterValue} onFilterChange={setFilterValue} />
    </main>
  )
}