import { HeartHandshake, LogOut, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { AnimalCard } from "@/components/animal-card";
import { HubSkeleton } from "@/components/hub-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { animalTypeLabels } from "@/data/animals";
import { useAnimalStore } from "@/stores/animal-store";
import { useAuthStore } from "@/stores/auth-store";
import type { AnimalType } from "@/types/animal";

const HubPage = () => {
  const navigate = useNavigate();
  const operatorEmail = useAuthStore((state) => state.operatorEmail);
  const logout = useAuthStore((state) => state.logout);
  const animals = useAnimalStore((state) => state.animals);
  const activeType = useAnimalStore((state) => state.activeType);
  const isLoading = useAnimalStore((state) => state.isLoading);
  const loadAnimals = useAnimalStore((state) => state.loadAnimals);
  const setActiveType = useAnimalStore((state) => state.setActiveType);

  useEffect(() => {
    void loadAnimals();
  }, [activeType, loadAnimals]);

  const availableAnimals = useMemo(
    () => animals.filter((animal) => animal.type === activeType && animal.status === "available"),
    [activeType, animals],
  );

  const handleTabChange = (value: string) => {
    setActiveType(value as AnimalType);
  };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-6 rounded-[2rem] bg-hero-gradient p-6 text-hero-foreground shadow-panel lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-primary-foreground/88">
              <HeartHandshake className="size-4" />
              Hub de seleção
            </div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">Adote com agilidade no evento.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/84 sm:text-base">
              Visualize os animais disponíveis, abra os detalhes e conclua a adoção com retorno imediato à listagem.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/70">Operador autenticado</p>
              <p className="mt-1 text-lg font-semibold">{operatorEmail}</p>
            </div>
            <Button
              variant="outline"
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </motion.header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[1.75rem] border border-border/70 bg-panel-glow p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Animais disponíveis</p>
                <h2 className="mt-2 text-2xl font-bold">Selecione a categoria para atendimento</h2>
              </div>
              <Tabs value={activeType} onValueChange={handleTabChange} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                  <TabsTrigger value="dog">Cachorros</TabsTrigger>
                  <TabsTrigger value="cat">Gatos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs value={activeType} className="mt-6">
              {(["dog", "cat"] as AnimalType[]).map((type) => (
                <TabsContent key={type} value={type}>
                  {isLoading ? (
                    <HubSkeleton />
                  ) : availableAnimals.length ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {availableAnimals.map((animal, index) => (
                        <AnimalCard key={animal.id} animal={animal} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-card/70 px-6 text-center">
                      <Sparkles className="size-10 text-primary" />
                      <h3 className="mt-4 text-xl font-bold">Nenhum {animalTypeLabels[type].toLowerCase()} disponível</h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Todos os animais dessa categoria já foram reservados no fluxo simulado.
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-[1.75rem] border border-border/70 bg-card/95 p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fluxo</p>
              <ol className="mt-4 space-y-4 text-sm leading-6 text-foreground">
                {[
                  "Filtre por Cachorros ou Gatos",
                  "Abra o perfil completo do animal",
                  "Preencha os dados do adotante",
                  "Confirme a adoção e remova o card da lista",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-secondary-foreground">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-secondary/65 p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Regras de exibição</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-secondary-foreground">
                <li>Somente animais com status disponível aparecem no hub.</li>
                <li>Após a confirmação, o animal fica indisponível imediatamente.</li>
                <li>O layout foi otimizado para paisagem e retrato em totem.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default HubPage;
