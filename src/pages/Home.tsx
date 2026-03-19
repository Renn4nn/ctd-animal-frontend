import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-hero-gradient opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.22),transparent_0_36%),radial-gradient(circle_at_80%_10%,hsl(var(--secondary)/0.35),transparent_0_28%)]" />

      {/* Aumentado para max-w-md para dar mais destaque no totem */}
      <section className="relative z-10 w-full max-w-md px-6">
        <motion.div
          // Aumentado o padding (p-10) e a altura mínima para o card ter mais corpo
          className="rounded-[2.5rem] border border-gray-200 bg-white/95 p-10 shadow-panel backdrop-blur-sm flex flex-col items-center justify-center min-h-[350px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.div 
            className="flex flex-col gap-6 w-full" // gap maior entre os botões
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Botões com h-16 (64px) e text-xl para facilitar o toque no totem */}
            <Button 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-16 text-xl font-bold rounded-2xl"
              onClick={() => navigate("/hub", { replace: true })}
            >
              Hub
            </Button>
            
            <Button 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-16 text-xl font-bold rounded-2xl"
              onClick={() => navigate("/controle", { replace: true })}
            >
              Controle
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}