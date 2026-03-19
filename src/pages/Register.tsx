import { demoCredentials } from "@/stores/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";

function onSubmit() {
  console.log("submit");
}


export default function Register() {
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
              <CardTitle className="text-3xl">Crie uma conta</CardTitle>
              <CardDescription className="text-base leading-7">
                Crie uma conta para acessar o hub de adoção.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}>
                 <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nome</label>
                  <Input type="text" placeholder="Seu nome completo" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">E-mail</label>
                  <Input type="email" placeholder="exemplo@dominio.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">CPF</label>
                  <Input type="text" placeholder="000.000.000-00" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Telefone</label>
                  <Input type="number" placeholder="(00) 00000-0000" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Senha</label>
                  <Input type="password" />
                </div>
                
                {/* <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errors.root?.message}
                </div> */}

                <Button className="w-full" size="lg" type="submit" variant="hero">
                  Criar conta
                </Button>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <a href="/login">Já tem uma conta? Faça login</a>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}