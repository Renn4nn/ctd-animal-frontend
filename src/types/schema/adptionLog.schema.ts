import { z } from "zod";

const isValidCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);

  const calc = (factor: number) =>
    ((digits
      .slice(0, factor - 1)
      .reduce((sum, num, i) => sum + num * (factor - i), 0) * 10) % 11) % 10;

  return calc(10) === digits[9] && calc(11) === digits[10];
};

// Consultar LGPD
export const adptionLogSchema = z.object({
  id: z.string().uuid(),
  animalId: z.string().uuid(),
  adopterName: z.string().min(1, "Nome é obrigatório"),
  adopterCpf: z
    .string()
    .min(11)
    .transform((v) => v.replace(/\D/g, ""))
    .refine(isValidCPF, "Digite um cpf válido."),
  adopterPhone: z.string().min(10, "Telefone é obrigatório"),
  adopterEmail: z.string().email("Email inválido"),
  adoptedAt: z.date(),
})

export const createAdptionLogSchema = z.object({
  animalId: z.string().uuid(),
  adopterName: z.string().min(2, "Nome é obrigatório"),
  adopterCpf: z
    .string()
    .min(11)
    .transform((v) => v.replace(/\D/g, ""))
    .refine(isValidCPF, "Digite um cpf válido."),
  adopterPhone: z.string().min(10, "Telefone é obrigatório"),
  adopterEmail: z.string().email("Email inválido"),
})

export const updateAdptionLogSchema = createAdptionLogSchema.partial()

export type AdptionLog = z.infer<typeof adptionLogSchema>;
export type AdptionLogCreate = z.infer<typeof createAdptionLogSchema>;
export type AdptionLogUpdate = z.infer<typeof updateAdptionLogSchema>;
