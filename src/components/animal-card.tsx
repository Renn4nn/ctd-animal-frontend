import { PawPrint } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Animal } from "@/types/animal";

interface AnimalCardProps {
  animal: Animal;
  index: number;
}

export const AnimalCard = ({ animal, index }: AnimalCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className="group overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={animal.photos[0]}
            alt={`Foto principal de ${animal.name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
              <PawPrint className="size-3.5" />
              Disponível
            </div>
          </div>
        </div>
        <CardContent className="grid gap-4 p-5">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{animal.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {animal.age} · {animal.breed}
            </p>
          </div>
          <p className="text-sm leading-7 text-foreground">{animal.description}</p>
          <Button className="w-full" variant="hero" onClick={() => navigate(`/animal/${animal.id}`)}>
            Ver detalhes e adotar
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
