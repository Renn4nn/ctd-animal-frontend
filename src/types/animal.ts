export type AnimalType = "dog" | "cat";
export type AnimalStatus = "available" | "adopted";

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  breed: string;
  age: string;
  description: string;
  story: string;
  behavior: string;
  vaccines: string[];
  size: "Pequeno" | "Médio" | "Grande";
  sex: "Macho" | "Fêmea";
  photos: string[];
  status: AnimalStatus;
}

export interface AdoptionFormValues {
  name: string;
  cpf: string;
  phone: string;
  email: string;
}

export interface AdoptionLog {
  animalId: string;
  adopter: AdoptionFormValues;
  adoptedAt: string;
}
