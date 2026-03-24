import { motion } from "framer-motion"
import { Logo } from "@/components/logo"


export function Header() {
  return (<>
    {/* Painel Esquerdo (Informativo) */}
    <motion.div
      className="hidden rounded-[2rem] border border-gray-200 bg-white/95 p-12 text-gray-900 shadow-panel backdrop-blur-sm lg:block"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex items-center gap-3">
        <Logo size={280} />
      </div>

      <motion.h2
        className="mt-10 max-w-2xl text-5xl font-extrabold tracking-tight"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Hub digital para adoção
        </span>
      </motion.h2>

      <motion.p
        className="mt-6 max-w-lg text-lg leading-relaxed text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Acesse o ambiente autorizado do evento e conduza o fluxo de atendimento
        com visual otimizado para totem.
      </motion.p>
    </motion.div>
  </>
  );
}