import { z } from "zod";

export const animalTypeSchema = z.object({
  id: z.number(),
  label: z.string().min(1, "O label é obrigatório"),
  active: z.boolean().default(true),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
})

export const createAnimalTypeSchema = z.object({
  label: z.string().min(1, "O label é obrigatório"),
});

export const updateAnimalTypeSchema = z.object({
  label: z.string().min(1).optional(),
  active: z.boolean().optional(),
});

export type AnimalType = z.infer<typeof animalTypeSchema>;
export type AnimalTypeUpdate = z.infer<typeof updateAnimalTypeSchema>;
export type AnimalTypeCreate = z.infer<typeof createAnimalTypeSchema>;
