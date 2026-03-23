export type AdoptionLogModel = {
  id: string;
  animalId: string;
  adopterName: string;
  adopterCpf: string;
  adopterPhone: string;
  adopterEmail: string;
  adoptedAt: Date;
}

export type AdoptionFormValues = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
};