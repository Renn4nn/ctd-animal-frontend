import { motion } from "framer-motion";
import { NavLink } from "@/components/NavLink";
import { Pencil, Trash2 } from "lucide-react";

const mockAnimals = [
  { id: 1, name: "Cachorro" },
  { id: 2, name: "Gato" },
  { id: 3, name: "Pássaro" },
];

export default function AnimalType() {
  return(
    <>  
        <h1 className="text-2xl font-bold mb-4">Controle dos Tipos de Animal</h1>
        <ul className="flex flex-col gap-2">
           {mockAnimals.map((animal) => (
          <motion.li
            key={animal.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="group relative"
          >
            <NavLink
              to={`/controle/animal/${animal.id}`}
              className="bg-primary/10 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold">{animal.name}</span>
              </div>

              {/* Container de Ações */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => console.log("Editar", animal.id)}
                  className="p-1.5 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => console.log("Excluir", animal.id)}
                  className="p-1.5 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </NavLink>
          </motion.li>
        ))}
        </ul>
    </>
  );
}
