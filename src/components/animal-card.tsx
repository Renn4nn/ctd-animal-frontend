import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Animal } from "@/types/schema/animal.schema";
import adotadoImg from "@/assets/adotado.png";

interface AnimalCardProps {
  animal: Animal;
  index: number;
  isAdopted?: boolean;
}

const getPhotoUrl = (photo: string): string => {
  if (!photo) return "https://www.freeiconspng.com/uploads/no-image-icon-4.png";
  if (photo.includes("photos/animals")) {
    const uuid = photo.split("/").pop();
    if (uuid) {
      return `${import.meta.env.VITE_API_BASE_URL || import.meta.env.API_BASE_URL || "http://localhost:3002"}/uploads/${uuid}`;
    }
  }
  return photo;
};


export const AnimalCard = ({ animal, index, isAdopted = false }: AnimalCardProps) => {
  const navigate = useNavigate();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const hasMultiplePhotos = animal.photos.length > 1;

  // Swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeThreshold = 50;
  const [coverMap, setCoverMap] = useState<Record<number, boolean>>({});

  const goToNext = useCallback(() => {
    setDirection(1);
    setActivePhotoIndex((prev) => (prev + 1) % animal.photos.length);
  }, [animal.photos.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setActivePhotoIndex((prev) => (prev - 1 + animal.photos.length) % animal.photos.length);
  }, [animal.photos.length]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasMultiplePhotos || isAdopted) return;
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setTranslateX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (translateX > swipeThreshold) {
      goToPrev();
    } else if (translateX < -swipeThreshold) {
      goToNext();
    }
    setTranslateX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTranslateX(0);
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultiplePhotos || isAdopted) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (translateX > swipeThreshold) {
      goToPrev();
    } else if (translateX < -swipeThreshold) {
      goToNext();
    }
    setTranslateX(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className="group overflow-hidden">
        <div
          ref={containerRef}
          className="relative aspect-[4/5] overflow-hidden cursor-grab active:cursor-grabbing bg-black/10 dark:bg-black/40"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={getPhotoUrl(animal.photos[activePhotoIndex])}
              className="h-full w-full object-cover blur-xl scale-125 opacity-50 dark:opacity-30"
              alt=""
            />
          </div>
          <img
            key={activePhotoIndex}
            src={getPhotoUrl(animal.photos[activePhotoIndex])}
            alt={`Foto ${activePhotoIndex + 1} de ${animal.name}`}
            className={`absolute inset-0 h-full w-full transition-all duration-300 ${isAdopted ? "grayscale" : ""} ${coverMap[activePhotoIndex] ? "object-cover" : "object-contain"}`}
            loading="lazy"
            onLoad={(e) => {
              const img = e.currentTarget;
              const parent = img.parentElement;
              if (!parent || !img.naturalWidth || !img.naturalHeight) return;
              const widthScale = parent.offsetWidth / img.naturalWidth;
              const heightScale = parent.offsetHeight / img.naturalHeight;
              const maxScale = Math.max(widthScale, heightScale);
              const minScale = Math.min(widthScale, heightScale);
              setCoverMap((prev) => ({ ...prev, [activePhotoIndex]: minScale / maxScale >= 0.70 }));
            }}
          />
          {hasMultiplePhotos && !isAdopted && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-sm p-2 opacity-0 transition-all duration-200 hover:bg-black/80 group-hover:opacity-100 shadow-md"
              >
                <ChevronLeft className="size-5 text-white drop-shadow" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-sm p-2 opacity-0 transition-all duration-200 hover:bg-black/80 group-hover:opacity-100 shadow-md"
              >
                <ChevronRight className="size-5 text-white drop-shadow" />
              </button>
              <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 flex gap-1.5">
                {animal.photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDirection(idx > activePhotoIndex ? 1 : -1);
                      setActivePhotoIndex(idx);
                    }}
                    className={`size-2 rounded-full transition-all ${idx === activePhotoIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"}`}
                  />
                ))}
              </div>
            </>
          )}
          {isAdopted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <img src={adotadoImg} alt="Adotado" className="w-3/4 object-contain" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 text-primary-foreground">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm ${isAdopted ? "bg-muted-foreground/30" : "bg-primary-foreground/12"}`}>
              <PawPrint className="size-3.5" />
              {isAdopted ? "Adotado" : "Disponível"}
            </div>
          </div>
        </div>
        <CardContent className="grid gap-4 p-5">
          <div>
            <h3 className={`text-2xl font-bold ${isAdopted ? "text-muted-foreground" : "text-foreground"}`}>{animal.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {animal.age} · {animal.breed}
            </p>
          </div>
          {!isAdopted ? (
            <Button className="w-full" variant="hero" onClick={() => navigate(`/animal/${animal.id}`)}>
              Ver detalhes e adotar
            </Button>
          ) : (
            <Button className="w-full" variant="hero" disabled>
              Ver detalhes e adotar
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
