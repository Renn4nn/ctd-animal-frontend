import { ChevronLeft, ChevronRight, Syringe } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Animal } from "@/types/animal";

interface AnimalGalleryProps {
  animal: Animal;
}

export const AnimalGallery = ({ animal }: AnimalGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    const total = animal.photos.length;
    setActiveIndex((index + total) % total);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/4.5] overflow-hidden bg-secondary/40 sm:aspect-[16/12]">
        <img
          src={animal.photos[activeIndex]}
          alt={`Foto ${activeIndex + 1} de ${animal.name}`}
          className="h-full w-full object-cover"
        />

        {animal.photos.length > 1 ? (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/85"
              onClick={() => goTo(activeIndex - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/85"
              onClick={() => goTo(activeIndex + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        ) : null}
      </div>

      <div className="grid gap-4 p-5">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {animal.photos.map((photo, index) => (
            <button
              key={`${animal.id}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <img
                src={photo}
                alt={`Miniatura ${index + 1} de ${animal.name}`}
                className={`h-24 w-24 object-cover transition-opacity ${index === activeIndex ? "opacity-100" : "opacity-60"}`}
              />
            </button>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-border bg-secondary/50 p-5">
          <div className="flex items-center gap-2 text-secondary-foreground">
            <Syringe className="size-5" />
            <p className="font-semibold">Saúde e preparo para adoção</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-secondary-foreground">
            Todos os dados apresentados aqui são mockados para validar o fluxo do totem durante o evento.
          </p>
        </div>
      </div>
    </Card>
  );
};
