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
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import cmtuLogo from "@/assets/cmtuLogo/cmtuLogo.png";
import prefeituraLogo from "@/assets/prefeituraLogo/prefeituraLogo.jpeg";

const HubPage = () => {
  const [activeTypeId, setActiveTypeId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: animalsResponse, isLoading: isLoadingAnimals } = useQuery({
    queryKey: ['animals'],
    queryFn: () => apiRequest<Animal[]>({
      method: 'get',
      url: '/animal'
    }),
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // refetch a cada 60 segundos
  });

  const { data: typesResponse, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['animal-types'],
    queryFn: () => apiRequest<AnimalType[]>({
      method: 'get',
      url: '/animal-type'
    }),
    staleTime: 30000,
    refetchOnWindowFocus: true,
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

  if (!isLoading && animalTypes.length === 0) {
    return (
      <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-card/70 overflow-hidden p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "out" }}
            className="relative flex min-h-[350px] w-full max-w-2xl flex-col items-center justify-center overflow px-6 text-center"
          >
            <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative mb-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <img src={cmtuLogo} alt="CMTU Londrina" className="h-[70px] w-auto object-contain drop-shadow-sm" />
              <Logo size={200} className="mr-3" />
              <img src={prefeituraLogo} alt="Prefeitura de Londrina" className="h-[70px] w-auto object-contain drop-shadow-sm" />
            </div>

            <div className="relative z-10 max-w-sm">
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                Nenhum tipo configurado
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80">
                Não existem categorias (tipos) de animais cadastradas ou ativas no sistema para exibição.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 relative z-10">
              <Button
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => navigate(`/controle/animal-type`)}
              >
                Cadastrar tipo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!isLoading && animals.length === 0) {
    return (
      <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "out" }}
            className="relative flex min-h-[350px] w-full max-w-2xl flex-col items-center justify-center overflow px-6 text-center"
          >
            <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative mb-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <img src={cmtuLogo} alt="CMTU Londrina" className="h-[70px] w-auto object-contain drop-shadow-sm" />
              <Logo size={200} className="mr-3" />
              <img src={prefeituraLogo} alt="Prefeitura de Londrina" className="h-[70px] w-auto object-contain drop-shadow-sm" />
            </div>

            <div className="relative z-10 max-w-sm">
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                Nenhum animal por aqui
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80">
                Não existem animais cadastrados e disponíveis na plataforma no momento.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 relative z-10">
              <Button
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => navigate(`/controle/animal`)}
              >
                Cadastrar amiguinho
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <PageTitle title="Hub" />
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between rounded-2xl px-6 text-primary"
        >
        </motion.header>

        <section className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-4 rounded-[2.5rem] border border-border/50 bg-gradient-to-b from-card/20 to-card/60 p-4 shadow-sm backdrop-blur-md sm:gap-12 sm:px-10 my-2"
          >
            <img src={cmtuLogo} alt="CMTU Londrina" className="h-[55px] w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105" />
            <Logo size={170} className="mr-3 transition-transform duration-300 hover:scale-105" />
            <img src={prefeituraLogo} alt="Prefeitura de Londrina" className="h-[55px] w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105" />
          </motion.div>
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
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "out" }}
                        className="relative flex min-h-[350px] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-b from-card/40 to-card/80 px-6 text-center shadow-inner mt-4"
                      >
                        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
                        <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

                        <div className="relative z-10 max-w-sm">
                          <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                            Nenhum {type.label.toLowerCase()} por aqui
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80">
                            Parece que nossa lista de <span className="font-semibold text-primary">{type.label.toLowerCase()}s</span> está vazia no momento. Que tal começar cadastrando um novo amiguinho?
                          </p>
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 relative z-10">
                          <Button
                            variant="outline"
                            className="rounded-full border-primary/30 bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300"
                            onClick={() => navigate(`/controle/animal`)}
                          >
                            Cadastrar agora
                          </Button>
                        </motion.div>
                      </motion.div>
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
