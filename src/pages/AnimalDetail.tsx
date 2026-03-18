import { ArrowLeft, CheckCircle2, Heart, LoaderCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { AnimalGallery } from "@/components/animal-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCpf, formatPhone, getDigits } from "@/lib/masks";
import { useAnimalStore } from "@/stores/animal-store";
import type { AdoptionFormValues } from "@/types/animal";
import { toast } from "@/components/ui/sonner";

const adoptionSchema = z.object({
  name: z.string().min(3, "Informe o nome completo."),
  cpf: z.string().refine((value) => getDigits(value).length === 11, "CPF inválido."),
  phone: z.string().refine((value) => getDigits(value).length >= 10, "Telefone inválido."),
  email: z.string().email("Digite um e-mail válido."),
});

const AnimalDetailPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [submitted, setSubmitted] = useState(false);
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
    toast.success("Adoção registrada com sucesso!", {
      description: `${animal.name} foi removido(a) da lista de disponíveis.`,
    });

    window.setTimeout(() => {
      navigate("/hub", { replace: true });
    }, 1600);
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
                    <form className="mt-5 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid gap-2">
                        <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nome</label>
                        <Input {...form.register("name")} placeholder="Nome completo do adotante" />
                        {form.formState.errors.name ? <p className="text-sm text-destructive">{form.formState.errors.name.message}</p> : null}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">CPF</label>
                          <Input
                            {...form.register("cpf")}
                            placeholder="000.000.000-00"
                            onChange={(event) => form.setValue("cpf", formatCpf(event.target.value), { shouldValidate: true })}
                            value={form.watch("cpf")}
                          />
                          {form.formState.errors.cpf ? <p className="text-sm text-destructive">{form.formState.errors.cpf.message}</p> : null}
                        </div>

                        <div className="grid gap-2">
                          <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Telefone</label>
                          <Input
                            {...form.register("phone")}
                            placeholder="(00) 00000-0000"
                            onChange={(event) => form.setValue("phone", formatPhone(event.target.value), { shouldValidate: true })}
                            value={form.watch("phone")}
                          />
                          {form.formState.errors.phone ? <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p> : null}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">E-mail</label>
                        <Input {...form.register("email")} placeholder="adotante@email.com" type="email" />
                        {form.formState.errors.email ? <p className="text-sm text-destructive">{form.formState.errors.email.message}</p> : null}
                      </div>

                      <Button className="mt-2 w-full" size="lg" type="submit" variant="hero" disabled={isLoading}>
                        {isLoading ? <LoaderCircle className="animate-spin" /> : null}
                        Confirmar adoção
                      </Button>
                    </form>
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
