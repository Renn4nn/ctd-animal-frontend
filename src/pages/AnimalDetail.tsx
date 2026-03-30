import { ArrowLeft, ArrowRight, CheckCircle2, Heart, LoaderCircle, ShieldCheck, Delete, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// UI Components
import { AnimalGallery } from "@/components/animal-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

// Utils & Types
import { formatCpf, formatPhone, getDigits } from "@/lib/masks";
import { apiRequest } from "@/lib/api/request";
import { useAnimalStore } from "@/stores/animal-store";
import { Animal } from "@/types/schema/animal.schema";
import { createAdptionLogSchema, type AdptionLogCreate } from "@/types/schema/adptionLog.schema";

const LETTERS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const NUMBERS = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["0"]];

const EMAIL_KEYS = [["@", ".", "_", "-"]];

// Tipagem baseada nas chaves do seu novo Schema (omitindo o ID do animal que já temos)
type FormField = keyof Omit<AdptionLogCreate, "animalId">;
type Step = FormField | "review";

const STEP_ORDER: Step[] = ["adopterName", "adopterCpf", "adopterPhone", "adopterEmail", "review"];

const STEP_CONFIG: Record<Step, { label: string; keyboard: "letters" | "numbers" | "email" | "none" }> = {
  adopterName: { label: "Qual é o seu nome completo?", keyboard: "letters" },
  adopterCpf: { label: "Qual é o seu CPF?", keyboard: "numbers" },
  adopterPhone: { label: "Qual é o seu telefone?", keyboard: "numbers" },
  adopterEmail: { label: "Qual é o seu e-mail?", keyboard: "email" },
  review: { label: "Revise seus dados", keyboard: "none" },
};

const AnimalDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id = "" } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("adopterName");
  const [formOpen, setFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: response, isLoading: isLoadingAnimal } = useQuery({
    queryKey: ['animal', id],
    queryFn: () => apiRequest<Animal, never>({
      method: 'get',
      url: `/animal/${id}`
    }),
    enabled: !!id
  });

  const animal = response && 'data' in response ? response.data : null;
  const isLoadingStore = useAnimalStore((state) => state.isLoading);
  const isLoading = isLoadingAnimal || isLoadingStore;

  const summary = useMemo(() => animal ? [
    { label: "Porte", value: animal.size || "---" },
    { label: "Sexo", value: animal.sex || "---" },
    { label: "Raça", value: animal.breed || "---" },
    { label: "Idade", value: animal.age || "---" },
  ] : [], [animal]);

  const form = useForm<AdptionLogCreate>({
    resolver: zodResolver(createAdptionLogSchema),
    defaultValues: {
      animalId: id,
      adopterName: "",
      adopterCpf: "",
      adopterPhone: "",
      adopterEmail: "",
    },
    mode: "onChange",
  });

  if (isLoadingAnimal) {
    return (
      <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm flex min-h-[400px] items-center justify-center">
          <LoaderCircle className="size-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (!animal || animal.status !== "Disponivel") {
    return <Navigate to="/hub" replace />;
  }

  const handleKeyPress = (key: string) => {
    if (currentStep === "review") return;
    const field = currentStep as FormField;
    const currentValue = form.watch(field) || "";
    let newValue = currentValue + key;

    if (field === "adopterCpf") newValue = formatCpf(currentValue + key);
    else if (field === "adopterPhone") newValue = formatPhone(currentValue + key);

    form.setValue(field, newValue, { shouldValidate: true });
  };

  const handleBackspace = () => {
    if (currentStep === "review") return;
    const field = currentStep as FormField;
    const currentValue = form.watch(field) || "";
    let newValue = currentValue.slice(0, -1);

    if (field === "adopterCpf") newValue = formatCpf(getDigits(newValue));
    else if (field === "adopterPhone") newValue = formatPhone(getDigits(newValue));

    form.setValue(field, newValue, { shouldValidate: true });
  };

  const handleSpace = () => {
    if (currentStep === "adopterName" || currentStep === "adopterEmail") {
      const field = currentStep as FormField;
      const currentValue = form.watch(field) || "";
      form.setValue(field, currentValue + " ", { shouldValidate: true });
    }
  };

  const canProceed = () => {
    if (currentStep === "review") return true;
    const field = currentStep as FormField;
    const value = form.watch(field);
    const hasError = !!form.formState.errors[field];

    if (!value || hasError) return false;

    // Validações de comprimento mínimo para habilitar o botão "Próximo" no Totem
    switch (currentStep) {
      case "adopterName": return value.length >= 2;
      case "adopterCpf": return getDigits(value).length === 11;
      case "adopterPhone": return getDigits(value).length >= 10;
      case "adopterEmail": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      default: return true;
    }
  };

  const onSubmit = async (values: AdptionLogCreate) => {
    setIsSubmitting(true);

    const adoptionRes = await apiRequest({
      method: 'post',
      url: '/adption-log',
      data: values,
    });

    if ('error' in adoptionRes) {
      toast.error('Erro ao registrar adoção. Verifique seus dados.');
      setIsSubmitting(false);
      return;
    }

    await apiRequest({
      method: 'patch',
      url: `/animal/${animal.id}`,
      data: { status: 'Adotado' },
    });

    // Invalida queries para atualizar Hub, Logs e Animal
    await queryClient.invalidateQueries({ queryKey: ['animals'] });
    await queryClient.invalidateQueries({ queryKey: ['adption-logs'] });
    await queryClient.invalidateQueries({ queryKey: ['animal', id] });

    setSubmitted(true);
    setFormOpen(false);
    toast.success('Adoção registrada!', { description: `${animal.name} agora tem um novo lar.` });

    setTimeout(() => navigate("/hub", { replace: true }), 2000);
  };

  const goToNextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) setCurrentStep(STEP_ORDER[currentIndex + 1]);
  };

  const goToPrevStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) setCurrentStep(STEP_ORDER[currentIndex - 1]);
  };

  const openForm = () => {
    setFormOpen(true);
    setCurrentStep("adopterName");
    form.reset({ animalId: id, adopterName: "", adopterCpf: "", adopterPhone: "", adopterEmail: "" });
  };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Button variant="outline" onClick={() => navigate("/hub")}>
            <ArrowLeft className="size-4 mr-2" /> Voltar ao hub
          </Button>
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
                  <InfoSection title="História" content={animal.story} />
                  <InfoSection title="Comportamento" content={animal.behavior} />
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Vacinas e cuidados
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {animal.vaccines && animal.vaccines.length > 0 ? (
                        animal.vaccines.map((v, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground"
                          >
                            {v}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Informações de vacinação não disponíveis.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border bg-panel-glow p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Heart className="size-5 fill-current" />
                    <h2 className="text-xl font-bold">Quero Adotar</h2>
                  </div>

                  {submitted ? (
                    <div className="mt-5 rounded-[1.5rem] border border-success/20 bg-secondary px-5 py-6">
                      <div className="flex items-center gap-3 text-lg font-bold text-foreground">
                        <CheckCircle2 className="size-6 text-success" /> Adoção confirmada!
                      </div>
                      <p className="mt-3 text-sm">O perfil de {animal.name} foi reservado com sucesso.</p>
                    </div>
                  ) : (
                    <Button className="mt-5 w-full" size="lg" variant="hero" onClick={openForm}>Adote-me</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto p-0">
          <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Heart className="size-5 text-primary" /> Adotar {animal.name}
            </DialogTitle>
            <DialogDescription>Preencha os dados no totem para continuar.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4">
            {/* Progress Stepper */}
            <div className="mb-6 flex items-center justify-center gap-2">
              {STEP_ORDER.map((step, index) => {
                const currentIndex = STEP_ORDER.indexOf(currentStep);
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                return (
                  <div key={step} className="flex items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${isCompleted ? "bg-primary text-primary-foreground" : isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-muted text-muted-foreground"}`}>
                      {isCompleted ? <Check className="size-5" /> : index + 1}
                    </div>
                    {index < STEP_ORDER.length - 1 && <div className={`mx-1 h-1 w-8 rounded-full ${isCompleted ? "bg-primary" : "bg-muted"}`} />}
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="grid gap-4">
                <h3 className="text-center text-xl font-bold">{STEP_CONFIG[currentStep].label}</h3>

                {currentStep === "review" ? (
                  <div className="grid gap-3 rounded-xl border border-border bg-card p-4">
                    <ReviewItem label="Nome" value={form.watch("adopterName")} />
                    <ReviewItem label="CPF" value={form.watch("adopterCpf")} />
                    <ReviewItem label="Telefone" value={form.watch("adopterPhone")} />
                    <ReviewItem label="E-mail" value={form.watch("adopterEmail")} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input value={form.watch(currentStep as FormField)} readOnly className="h-14 text-center text-lg focus-visible:ring-0" />
                    {form.formState.errors[currentStep as FormField] && (
                      <p className="text-center text-sm text-destructive font-medium">{form.formState.errors[currentStep as FormField]?.message}</p>
                    )}
                  </div>
                )}

                {/* Virtual Keyboard */}
                {STEP_CONFIG[currentStep].keyboard !== "none" && (
                  <div className="rounded-xl bg-muted p-4">
                    {(STEP_CONFIG[currentStep].keyboard === "letters" || STEP_CONFIG[currentStep].keyboard === "email") && (
                      <div className="grid gap-2">
                        {LETTERS.map((row, i) => (
                          <div key={i} className="flex justify-center gap-1.5">
                            {row.map(k => <KeyButton key={k} label={k} onClick={() => handleKeyPress(k)} />)}
                          </div>
                        ))}
                        <div className="flex justify-center gap-2 pt-2">
                          {STEP_CONFIG[currentStep].keyboard === "email" && EMAIL_KEYS[0].map(k => (
                            <KeyButton key={k} label={k} onClick={() => handleKeyPress(k)} className="w-14" />
                          ))}
                          <KeyButton label="Espaço" onClick={handleSpace} className="w-36" />
                          <KeyButton label={<Delete className="size-6" />} onClick={handleBackspace} className="w-20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" />
                        </div>
                      </div>
                    )}

                    {STEP_CONFIG[currentStep].keyboard === "numbers" && (
                      <div className="grid gap-3">
                        {NUMBERS.map((row, i) => (
                          <div key={i} className="flex justify-center gap-3">
                            {row.map(k => <KeyButton key={k} label={k} onClick={() => handleKeyPress(k)} className="h-16 w-24 text-2xl" />)}
                          </div>
                        ))}
                        <div className="flex justify-center pt-2">
                          <KeyButton label={<Delete className="size-7" />} onClick={handleBackspace} className="h-16 w-40 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" size="lg" onClick={currentStep === "adopterName" ? () => setFormOpen(false) : goToPrevStep}>
                    {currentStep === "adopterName" ? "Cancelar" : "Voltar"}
                  </Button>
                  {currentStep === "review" ? (
                    <Button className="flex-1" size="lg" variant="hero" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                      {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Check className="mr-2 size-4" />} Confirmar Adoção
                    </Button>
                  ) : (
                    <Button className="flex-1" size="lg" variant="hero" onClick={goToNextStep} disabled={!canProceed()}>
                      Próximo <ArrowRight className="ml-2 size-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

// Sub-componentes auxiliares
const getEmptyMessage = (title: string) => {
  switch (title) {
    case "História":
      return "Ainda não temos a história deste animal.";
    case "Comportamento":
      return "Ainda estamos conhecendo o comportamento deste animal.";
    default:
      return "Informação não disponível.";
  }
};

const InfoSection = ({ title, content }: { title: string; content: string }) => {
  const displayContent =
    content && content.trim() !== "" ? content : getEmptyMessage(title);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <p className="text-sm text-muted-foreground">
        {displayContent}
      </p>
    </div>
  );
};

const ReviewItem = ({ label, value }: { label: string; value: string }) => {
  const displayValue = value && value.trim() !== "" ? value : "---";

  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="font-medium">{displayValue}</span>
    </div>
  );
};

const KeyButton = ({ label, onClick, className = "" }: { label: React.ReactNode; onClick: () => void; className?: string }) => (
  <button type="button" onClick={onClick} className={`flex h-14 w-11 items-center justify-center rounded-lg bg-card text-lg font-semibold shadow-sm transition-all hover:bg-primary hover:text-white active:scale-95 ${className}`}>
    {label}
  </button>
);

export default AnimalDetailPage;