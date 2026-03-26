import { z } from "zod";

export const animalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Nome é obrigatório"),
  typeId: z.number().int(),
  breed: z.string().min(1, "Raça é obrigatória"),
  age: z.string(),
  description: z.string().nullable(),
  story: z.string().nullable(),
  behavior: z.string().nullable(),
  vaccines: z.array(z.string()).default([]),
  size: z.enum(["Pequeno", "Medio", "Grande"]),
  sex: z.enum(["Macho", "Femea"]),
  photos: z
    .union([
      z.array(z.string()),
      z.string().transform((val) => JSON.parse(val)),
    ])
    .optional()
    .default([]),
  status: z.enum(["Disponivel", "Adotado"]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createAnimalSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  typeId: z.number().int(),
  breed: z.string().min(1, "Raça é obrigatória"),
  age: z.string(),
  description: z.string().nullable(),
  story: z.string().nullable(),
  behavior: z.string().nullable(),
  vaccines: z.array(z.string()).default([]),
  size: z.enum(["Pequeno", "Medio", "Grande"]),
  sex: z.enum(["Macho", "Femea"]),
  photos: z
    .union([
      z.array(z.string()),
      z.string().transform((val) => JSON.parse(val)),
    ])
    .optional()
    .default([]),
  status: z.enum(["Disponivel", "Adotado"]).default("Disponivel"),
})

export const updateAnimalSchema = createAnimalSchema.partial()

export type Animal = z.infer<typeof animalSchema>;
export type AnimalCreate = z.infer<typeof createAnimalSchema>;
export type AnimalUpdate = z.infer<typeof updateAnimalSchema>;
