import { LoaderCircle, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoCredentials, useAuthStore } from "@/stores/auth-store";
import { Header } from "@/components/Header";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(1, "Digite a senha."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionToken = useAuthStore((state) => state.sessionToken);
  const login = useAuthStore((state) => state.login);

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
    const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/home";
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      navigate("/home", { replace: true });
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Não foi possível autenticar.",
      });
    }
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-hero-gradient opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.22),transparent_0_36%),radial-gradient(circle_at_80%_10%,hsl(var(--secondary)/0.35),transparent_0_28%)]" />

      <section className="relative z-10 grid min-h-screen w-full items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        
        <Header />

        {/* Painel Direito (Login) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto w-full max-w-xl"
        >
          <Card className="border-primary-foreground/20 bg-white/95 shadow-panel backdrop-blur-md">
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
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Senha</label>
                  <Input {...register("password")} type="password" autoComplete="current-password" />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                {errors.root && (
                  <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errors.root.message}
                  </p>
                )}

                <div className="rounded-2xl border border-border bg-secondary/60 p-4 text-sm leading-6 text-secondary-foreground">
                  <strong className="block font-semibold">Acesso de teste</strong>
                  {demoCredentials.email} · {demoCredentials.password}
                </div>

                <Button className="w-full" size="lg" type="submit" variant="hero" disabled={isSubmitting}>
                  {isSubmitting && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                  Entrar no hub
                </Button>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <a href="/register">Não tem uma conta? Crie uma</a>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
};

export default LoginPage;