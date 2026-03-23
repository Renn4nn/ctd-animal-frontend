import { LogOut, Sparkles } from "lucide-react";
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


const HubPage = () => {
  const navigate = useNavigate();
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
    setActiveType(value);
  };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between rounded-2xl px-6 text-primary"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 border-none bg-white/10 text-xs font-semibold hover:bg-red-800 hover:text-white"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut className="size-3.5" />
            Sair
          </Button>

        </motion.header>

        <section className="grid gap-4">
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
              {(["dog", "cat"]).map((type) => (
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
        </section>
      </div>
    </main>
  );
};

export default HubPage;
