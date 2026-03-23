import { Plus, Trash2, Pencil, LogOut, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useAuthStore } from "@/stores/auth-store";

const menuItems = [
  { to: "/controle/criar", icon: Plus, label: "Criar" },
  { to: "/controle/editar", icon: Pencil, label: "Editar" },
  { to: "/controle/deletar", icon: Trash2, label: "Deletar" },
];

export default function Controle() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const operationLogin = useAuthStore((state) => state.operationLogin);

  const isRootPath = location.pathname === "/controle";

  return (
    <main className="relative flex min-h-screen overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-hero-gradient opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.22),transparent_0_36%),radial-gradient(circle_at_80%_10%,hsl(var(--secondary)/0.35),transparent_0_28%)]" />

      <div className="relative z-10 flex w-full">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex w-64 flex-col border-r border-white/20 bg-white/80 backdrop-blur-md"
        >
          {/* Header da Sidebar */}
          <div className="flex items-center gap-3 border-b border-white/20 p-6 font-semibold align-middle">
            <div className="flex h-10 w-10 items-center justify-center rounded-full">
              <span className="text-lg font-bold text-gray-700"><Wrench size={27} /></span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Controle
              </p>
              <p className="text-xs text-muted-foreground">{operationLogin}</p>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="flex-1 p-4">
            <ul className="flex flex-col gap-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.to}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </NavLink>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Botão de Logout */}
          <div className="border-t border-white/20 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </motion.aside>

        {/* Conteúdo Principal */}
        <section className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-[2rem] border border-white/20 bg-white/80 p-8 shadow-panel backdrop-blur-md"
          >
            {isRootPath ? (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <h1 className="text-3xl font-bold text-gray-900">
                    Bem-vindo ao Painel de Controle
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Selecione uma opção no menu lateral para começar
                  </p>
                </motion.div>
              </div>
            ) : (
              <Outlet />
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
