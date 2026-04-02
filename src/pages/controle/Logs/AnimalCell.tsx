import { PawPrint, Info } from "lucide-react"
import { apiRequest } from "@/lib/api/request"
import { Animal } from "@/types/schema/animal.schema"
import { AnimalType } from "@/types/schema/animalType.schema"
import { useQuery } from "@tanstack/react-query"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function AnimalCell({ animalId }: { animalId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["animal", animalId],
    queryFn: async () => {
      const response = await apiRequest<Animal, never>({
        method: 'get',
        url: `/animal/${animalId}`,
      })
      return response
    }
  })

  const { data: animalTypesData } = useQuery({
    queryKey: ["animal-types"],
    queryFn: async () => {
      const response = await apiRequest<{ data: AnimalType[] }, never>({
        method: 'get',
        url: `/animal-type`,
      })
      return response
    }
  })

  const getAnimalTypeLabel = (typeId: number | undefined) => {
    if (!typeId || !animalTypesData?.data) return "N/A"
    const type = animalTypesData.data.find(t => t.id === typeId)
    return type?.label || "N/A"
  }

  const animal = data?.data

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  if (isError || !animal) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Animal não encontrado</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium uppercase">{animal.name}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Info size={14} className="text-blue-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">{animal.name}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Tipo:</span> {getAnimalTypeLabel(animal.typeId)}</div>
              <div><span className="text-muted-foreground">Raça:</span> {animal.breed}</div>
              <div><span className="text-muted-foreground">Idade:</span> {animal.age}</div>
              <div><span className="text-muted-foreground">Sexo:</span> {animal.sex}</div>
              <div><span className="text-muted-foreground">Porte:</span> {animal.size}</div>
            </div>
            {animal.description && (
              <p className="text-xs text-muted-foreground">{animal.description}</p>
            )}
            {animal.vaccines && animal.vaccines.length > 0 && (
              <div className="text-xs">
                <span className="text-muted-foreground">Vacinas: </span>
                {animal.vaccines.join(', ')}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}