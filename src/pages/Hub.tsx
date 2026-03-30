import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimalCard } from "@/components/animal-card";
import { HubSkeleton } from "@/components/hub-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/api/request";
import { Animal } from "@/types/schema/animal.schema";
import { AnimalType } from "@/types/schema/animalType.schema";
import { Logo } from "@/components/logo";

const HubPage = () => {
  const [activeTypeId, setActiveTypeId] = useState<number | null>(null);

  const { data: animalsResponse, isLoading: isLoadingAnimals } = useQuery({
    queryKey: ['hub-animals'],
    queryFn: () => apiRequest<Animal[]>({
      method: 'get',
      url: '/animal'
    })
  });

  const { data: typesResponse, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['hub-animal-types'],
    queryFn: () => apiRequest<AnimalType[]>({
      method: 'get',
      url: '/animal-type'
    })
  });

  const animals = animalsResponse && 'data' in animalsResponse ? animalsResponse.data : [];
  const animalTypes = typesResponse && 'data' in typesResponse ? typesResponse.data.filter(t => t.active) : [];

  // Set initial active type when types load
  if (activeTypeId === null && animalTypes.length > 0) {
    setActiveTypeId(animalTypes[0].id);
  }

  const availableAnimals = useMemo(
    () => animals
      .filter((animal) => animal.typeId === activeTypeId && (animal.status === "Disponivel" || animal.status === "Adotado"))
      .sort((a, b) => {
        if (a.status === "Adotado" && b.status !== "Adotado") return 1;
        if (a.status !== "Adotado" && b.status === "Adotado") return -1;
        return 0;
      }),
    [activeTypeId, animals]
  );

  const handleTabChange = (value: string) => {
    setActiveTypeId(Number(value));
  };

  const isLoading = isLoadingAnimals || isLoadingTypes;
  if (!isLoading && animals.length === 0) {
    return (
      <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8 items-center justify-center">
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center rounded-2xl px-6 text-primary"
          >
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.5rem] px-6 text-center">
              <Logo size={300} />
              <h3 className="mt-4 text-xl font-bold">
                Nenhum animal disponível no momento
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Não existem animais cadastrados ou a API não retornou dados.
              </p>
            </div>
          </motion.header>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between rounded-2xl px-6 text-primary"
        >
        </motion.header>

        <section className="grid gap-4">
          <div className="rounded-[1.75rem] border border-border/70 bg-panel-glow p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Animais disponíveis</p>
                <h2 className="mt-2 text-2xl font-bold">Selecione a categoria para atendimento</h2>
              </div>
              <Tabs value={activeTypeId?.toString()} onValueChange={handleTabChange} className="w-full sm:w-auto">
                <TabsList className="grid w-full sm:w-auto" style={{ gridTemplateColumns: `repeat(${animalTypes.length}, minmax(0, 1fr))` }}>
                  {animalTypes.map((type) => (
                    <TabsTrigger key={type.id} value={type.id.toString()}>
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <Tabs value={activeTypeId?.toString()} className="mt-6">
              {isLoading ? (
                <HubSkeleton />
              ) : (
                animalTypes.map((type) => (
                  <TabsContent key={type.id} value={type.id.toString()}>
                    {availableAnimals.length ? (
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {availableAnimals.map((animal, index) => (
                          <AnimalCard key={animal.id} animal={animal} index={index} isAdopted={animal.status === "Adotado"} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-card/70 px-6 text-center">
                        <Logo size={300} />
                        <h3 className="mt-4 text-xl font-bold">Nenhum {type.label.toLowerCase()} disponível</h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                          Crie um novo animal para começar
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))
              )}
            </Tabs>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HubPage;
