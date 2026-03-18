import { LoaderCircle, LockKeyhole, PawPrint } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoCredentials, useAuthStore } from "@/stores/auth-store";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(1, "Digite a senha."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionToken, login } = useAuthStore((state) => ({
    sessionToken: state.sessionToken,
    login: state.login,
  }));

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: demoCredentials.email,
      password: demoCredentials.password,
    },
  });

  if (sessionToken) {
    const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/hub";
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      navigate("/hub", { replace: true });
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Não foi possível autenticar.",
      });
    }
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.22),transparent_0_36%),radial-gradient(circle_at_80%_10%,hsl(var(--secondary)/0.35),transparent_0_28%)]" />

      <section className="relative z-10 grid min-h-screen w-full items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <motion.div
          className="hidden rounded-[2rem] border border-primary-foreground/20 bg-primary-foreground/10 p-8 text-primary-foreground shadow-panel backdrop-blur-sm lg:block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/80">
            <PawPrint className="size-5" />
            PetMatch Totem
          </div>
          <h1 className="mt-10 max-w-xl text-5xl font-extrabold leading-[1.02]">
            Hub digital para adoções rápidas, seguras e acolhedoras.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-primary-foreground/82">
            Acesse o ambiente autorizado do evento e conduza o fluxo de adoção com visual pensado para atendimento em totem.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "Login único para equipe autorizada",
              "Hub com cães e gatos disponíveis",
              "Confirmação com remoção automática da lista",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 text-sm leading-6">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto w-full max-w-xl"
        >
          <Card className="border-primary-foreground/20 bg-card/92 shadow-panel backdrop-blur-md">
            <CardHeader className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
                <LockKeyhole className="size-4" />
                Área restrita
              </div>
              <CardTitle className="text-3xl">Acessar totem</CardTitle>
              <CardDescription className="text-base leading-7">
                Entre com a credencial autorizada para abrir o hub de adoção.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">E-mail</label>
                  <Input {...register("email")} autoComplete="username" />
                  {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Senha</label>
                  <Input {...register("password")} type="password" autoComplete="current-password" />
                  {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
                </div>

                {errors.root ? (
                  <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errors.root.message}
                  </p>
                ) : null}

                <div className="rounded-2xl border border-border bg-secondary/60 p-4 text-sm leading-6 text-secondary-foreground">
                  <strong className="block font-semibold">Acesso de teste</strong>
                  {demoCredentials.email} · {demoCredentials.password}
                </div>

                <Button className="w-full" size="lg" type="submit" variant="hero" disabled={isSubmitting}>
                  {isSubmitting ? <LoaderCircle className="animate-spin" /> : null}
                  Entrar no hub
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
};

export default LoginPage;
