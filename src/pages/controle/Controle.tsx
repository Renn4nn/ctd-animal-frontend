import { Settings, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Outlet, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useAuthStore } from "@/stores/auth-store";
import { Logo } from "@/components/logo";

const menuItems = [
  { to: "/controle/animal", icon: Settings, label: "Gerenciar Animal" },
  { to: "/controle/animal-type", icon: Settings, label: "Gerenciar Tipos de Animal" },
  { to: "/controle/logs", icon: Settings, label: "Relatórios" },
];

export default function Controle() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const operationLogin = useAuthStore((state) => state.operationLogin);

  const activeMenu = [...menuItems]
    .reverse() // Invertemos para que caminhos mais longos (específicos) sejam testados primeiro
    .find(item => location.pathname.startsWith(item.to));
  const currentLabel = activeMenu?.label || "Painel de Controle";

  if (location.pathname === "/controle") {
    return <Navigate to="/controle/animal" replace />;
  }

  const HEADER_HEIGHT = "h-20";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100/100">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col border-r border-black/5 bg-white z-20">
        <div className={`flex items-center justify-center border-b border-black/5 ${HEADER_HEIGHT}`}>
          <Logo size={200} />
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-all"
              activeClassName="bg-primary/10 text-primary"
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-black/5 p-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
            <LogOut className="size-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className={`flex items-center justify-between border-b border-black/5 bg-white px-8 ${HEADER_HEIGHT}`}>
          <div className="flex flex-col">
            <motion.h2
              key={location.pathname}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-slate-800 tracking-wider"
            >
              {currentLabel}
            </motion.h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-black font-semibold">{operationLogin}</span>
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-black/5">
              <User className="size-5 text-slate-500" />
            </div>
            <Button className="border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-6 h-12 transition-all active:scale-95" onClick={() => navigate('/hub')}>Hub</Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto h-full max-w-7xl">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="min-h-100 w-full rounded-[2rem] border border-white/10 bg-white/90 p-8 shadow-xl pt-4"
            >
              <Outlet />
            </motion.div>
            <div className="h-16 p-1" />
          </div>
        </main>
      </div>
    </div>
  );
}