import { ArrowLeft, ArrowRight, CheckCircle2, Heart, LoaderCircle, ShieldCheck, Delete, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { AnimalGallery } from "@/components/animal-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatCpf, formatPhone, getDigits } from "@/lib/masks";
import { useAnimalStore } from "@/stores/animal-store";
import type { AdoptionFormValues } from "@/types/adptionLog";
import { toast } from "@/components/ui/sonner";

const adoptionSchema = z.object({
  name: z.string().min(3, "Informe o nome completo."),
  cpf: z.string().refine((value) => getDigits(value).length === 11, "CPF inválido."),
  phone: z.string().refine((value) => getDigits(value).length >= 10, "Telefone inválido."),
  email: z.string().email("Digite um e-mail válido."),
});

const LETTERS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const NUMBERS = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["0"]];

const EMAIL_KEYS = [["@", ".", "_", "-"]];

type Step = "name" | "cpf" | "phone" | "email" | "review";
type FormField = "name" | "cpf" | "phone" | "email";

const STEP_ORDER: Step[] = ["name", "cpf", "phone", "email", "review"];

const STEP_CONFIG: Record<Step, { label: string; keyboard: "letters" | "numbers" | "email" | "none" }> = {
  name: { label: "Qual é o seu nome completo?", keyboard: "letters" },
  cpf: { label: "Qual é o seu CPF?", keyboard: "numbers" },
  phone: { label: "Qual é o seu telefone?", keyboard: "numbers" },
  email: { label: "Qual é o seu e-mail?", keyboard: "email" },
  review: { label: "Revise seus dados", keyboard: "none" },
};

const AnimalDetailPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [formOpen, setFormOpen] = useState(false);
  const animal = useAnimalStore((state) => state.findAnimal(id));
  const adoptAnimal = useAnimalStore((state) => state.adoptAnimal);
  const isLoading = useAnimalStore((state) => state.isLoading);

  const form = useForm<AdoptionFormValues>({
    resolver: zodResolver(adoptionSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      email: "",
    },
    mode: "onChange",
  });

  const summary = useMemo(
    () =>
      animal
        ? [
          { label: "Porte", value: animal.size },
          { label: "Sexo", value: animal.sex },
          { label: "Raça", value: animal.breed },
          { label: "Idade", value: animal.age },
        ]
        : [],
    [animal],
  );

  if (!animal || animal.status !== "available") {
    return <Navigate to="/hub" replace />;
  }

  const onSubmit = async (values: AdoptionFormValues) => {
    await adoptAnimal(animal.id, values);
    setSubmitted(true);
    setFormOpen(false);
    toast.success("Adoção registrada com sucesso!", {
      description: `${animal.name} foi removido(a) da lista de disponíveis.`,
    });

    window.setTimeout(() => {
      navigate("/hub", { replace: true });
    }, 1600);
  };

  const handleKeyPress = (key: string) => {
    if (currentStep === "review") return;

    const field = currentStep as FormField;
    const currentValue = form.watch(field) || "";
    let newValue = currentValue;

    if (currentStep === "cpf") {
      newValue = formatCpf(currentValue + key);
    } else if (currentStep === "phone") {
      newValue = formatPhone(currentValue + key);
    } else {
      newValue = currentValue + key;
    }

    form.setValue(field, newValue, { shouldValidate: true });
  };

  const handleBackspace = () => {
    if (currentStep === "review") return;

    const field = currentStep as FormField;
    const currentValue = form.watch(field) || "";
    let newValue = currentValue.slice(0, -1);

    if (currentStep === "cpf") {
      newValue = formatCpf(getDigits(newValue));
    } else if (currentStep === "phone") {
      newValue = formatPhone(getDigits(newValue));
    }

    form.setValue(field, newValue, { shouldValidate: true });
  };

  const handleSpace = () => {
    if (currentStep === "name" || currentStep === "email") {
      const field = currentStep as FormField;
      const currentValue = form.watch(field) || "";
      form.setValue(field, currentValue + " ", { shouldValidate: true });
    }
  };

  const goToNextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  const goToPrevStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    if (currentStep === "review") return true;

    const field = currentStep as FormField;
    const value = form.watch(field);
    if (!value) return false;

    switch (currentStep) {
      case "name":
        return value.length >= 3;
      case "cpf":
        return getDigits(value).length === 11;
      case "phone":
        return getDigits(value).length >= 10;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      default:
        return true;
    }
  };

  const openForm = () => {
    setFormOpen(true);
    setCurrentStep("name");
    form.reset();
  };

  const closeForm = () => {
    setFormOpen(false);
    setCurrentStep("name");
  };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Button variant="outline" onClick={() => navigate("/hub")}>
            <ArrowLeft className="size-4" />
            Voltar ao hub
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
            <ShieldCheck className="size-4" />
            Fluxo assistido no totem
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <AnimalGallery animal={animal} />
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
            <Card className="overflow-hidden">
              <div className="bg-hero-gradient px-6 py-7 text-hero-foreground">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/78">Perfil do animal</p>
                <h1 className="mt-3 text-4xl font-extrabold">{animal.name}</h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/84">{animal.description}</p>
              </div>
              <CardContent className="grid gap-6 p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {summary.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-secondary/45 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-base font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 rounded-[1.5rem] border border-border bg-card p-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">História</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">{animal.story}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Comportamento</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">{animal.behavior}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Vacinas e cuidados</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {animal.vaccines.map((vaccine) => (
                        <span key={vaccine} className="rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground">
                          {vaccine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border bg-panel-glow p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Heart className="size-5" />
                    <h2 className="text-xl font-bold">Formulário do adotante</h2>
                  </div>

                  {submitted ? (
                    <div className="mt-5 rounded-[1.5rem] border border-success/20 bg-secondary px-5 py-6 text-secondary-foreground">
                      <div className="flex items-center gap-3 text-lg font-bold text-foreground">
                        <CheckCircle2 className="size-6 text-success" />
                        Adoção confirmada
                      </div>
                      <p className="mt-3 text-sm leading-7">
                        O perfil de {animal.name} foi reservado e você será redirecionado ao hub em instantes.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Button className="mt-5 w-full" size="lg" variant="hero" onClick={openForm}>
                        Adote-me
                      </Button>

                      <Dialog open={formOpen} onOpenChange={setFormOpen}>
                        <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto p-0">
                          <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
                            <DialogTitle className="flex items-center gap-2 text-xl">
                              <Heart className="size-5 text-primary" />
                              Adotar {animal.name}
                            </DialogTitle>
                            <DialogDescription>
                              Preencha seus dados para iniciar o processo de adoção.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="px-6 py-4">
                            {/* Indicador de progresso - todas as etapas */}
                            <div className="mb-6 flex items-center justify-center gap-2">
                              {STEP_ORDER.map((step, index) => {
                                const currentIndex = STEP_ORDER.indexOf(currentStep);
                                const isCompleted = index < currentIndex;
                                const isCurrent = index === currentIndex;

                                return (
                                  <div key={step} className="flex items-center">
                                    <div
                                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${isCompleted
                                          ? "bg-primary text-primary-foreground"
                                          : isCurrent
                                            ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                      {isCompleted ? <Check className="size-5" /> : index + 1}
                                    </div>
                                    {index < STEP_ORDER.length - 1 && (
                                      <div
                                        className={`mx-1 h-1 w-8 rounded-full transition-colors ${isCompleted ? "bg-primary" : "bg-muted"
                                          }`}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Wizard de etapas */}
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="grid gap-4"
                              >
                                {/* Label da etapa */}
                                <h3 className="text-center text-xl font-bold">{STEP_CONFIG[currentStep].label}</h3>

                                {/* Campo atual */}
                                {currentStep === "review" ? (
                                  <div className="grid gap-3 rounded-xl border border-border bg-card p-4">
                                    <div className="grid gap-1">
                                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nome</span>
                                      <span className="font-medium">{form.watch("name")}</span>
                                    </div>
                                    <div className="grid gap-1">
                                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">CPF</span>
                                      <span className="font-medium">{form.watch("cpf")}</span>
                                    </div>
                                    <div className="grid gap-1">
                                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Telefone</span>
                                      <span className="font-medium">{form.watch("phone")}</span>
                                    </div>
                                    <div className="grid gap-1">
                                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">E-mail</span>
                                      <span className="font-medium">{form.watch("email")}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <Input
                                    value={form.watch(currentStep as keyof AdoptionFormValues)}
                                    readOnly
                                    placeholder={
                                      currentStep === "name" ? "Digite seu nome completo" :
                                        currentStep === "cpf" ? "000.000.000-00" :
                                          currentStep === "phone" ? "(00) 00000-0000" :
                                            "seu@email.com"
                                    }
                                    className="h-14 text-center text-lg"
                                  />
                                )}

                                {/* Teclado virtual */}
                                {STEP_CONFIG[currentStep].keyboard !== "none" && (
                                  <div className="rounded-xl bg-muted p-4">
                                    {/* Letras */}
                                    {(STEP_CONFIG[currentStep].keyboard === "letters" || STEP_CONFIG[currentStep].keyboard === "email") && (
                                      <div className="grid gap-2">
                                        {LETTERS.map((row, rowIndex) => (
                                          <div key={rowIndex} className="flex justify-center gap-1.5">
                                            {row.map((key) => (
                                              <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleKeyPress(key)}
                                                className="flex h-14 w-11 items-center justify-center rounded-lg bg-card text-lg font-semibold shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
                                              >
                                                {key}
                                              </button>
                                            ))}
                                          </div>
                                        ))}
                                        {/* Espaço e teclas especiais de email */}
                                        <div className="flex justify-center gap-2 pt-2">
                                          {STEP_CONFIG[currentStep].keyboard === "email" && (
                                            <>
                                              {EMAIL_KEYS[0].map((key) => (
                                                <button
                                                  key={key}
                                                  type="button"
                                                  onClick={() => handleKeyPress(key)}
                                                  className="flex h-14 w-14 items-center justify-center rounded-lg bg-card text-lg font-semibold shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
                                                >
                                                  {key}
                                                </button>
                                              ))}
                                            </>
                                          )}
                                          <button
                                            type="button"
                                            onClick={handleSpace}
                                            className="flex h-14 w-36 items-center justify-center rounded-lg bg-card font-semibold shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
                                          >
                                            Espaço
                                          </button>
                                          <button
                                            type="button"
                                            onClick={handleBackspace}
                                            className="flex h-14 w-20 items-center justify-center rounded-lg bg-destructive/10 text-destructive shadow-sm transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-95"
                                          >
                                            <Delete className="size-6" />
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Números */}
                                    {STEP_CONFIG[currentStep].keyboard === "numbers" && (
                                      <div className="grid gap-3">
                                        {NUMBERS.map((row, rowIndex) => (
                                          <div key={rowIndex} className="flex justify-center gap-3">
                                            {row.map((key) => (
                                              <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleKeyPress(key)}
                                                className="flex h-16 w-24 items-center justify-center rounded-lg bg-card text-2xl font-semibold shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
                                              >
                                                {key}
                                              </button>
                                            ))}
                                          </div>
                                        ))}
                                        <div className="flex justify-center gap-3 pt-2">
                                          <button
                                            type="button"
                                            onClick={handleBackspace}
                                            className="flex h-16 w-40 items-center justify-center rounded-lg bg-destructive/10 text-destructive shadow-sm transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-95"
                                          >
                                            <Delete className="size-7" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Botões de navegação */}
                                <div className="flex gap-3 pt-4">
                                  <Button variant="outline" className="flex-1" size="lg" onClick={currentStep === "name" ? closeForm : goToPrevStep}>
                                    {currentStep === "name" ? "Cancelar" : (
                                      <>
                                        <ArrowLeft className="mr-2 size-4" />
                                        Voltar
                                      </>
                                    )}
                                  </Button>

                                  {currentStep === "review" ? (
                                    <Button
                                      className="flex-1"
                                      size="lg"
                                      variant="hero"
                                      onClick={form.handleSubmit(onSubmit)}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? <LoaderCircle className="animate-spin" /> : <Check className="mr-2 size-4" />}
                                      Confirmar adoção
                                    </Button>
                                  ) : (
                                    <Button
                                      className="flex-1"
                                      size="lg"
                                      variant="hero"
                                      onClick={goToNextStep}
                                      disabled={!canProceed()}
                                    >
                                      Próximo
                                      <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                  )}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default AnimalDetailPage;
