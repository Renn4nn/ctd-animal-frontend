export type AnimalSize = "Pequeno" | "Medio" | "Grande";
export type AnimalSex = "Macho" | "Femea";
export type AnimalStatus = "Disponivel" | "Adotado";

export type AnimalModel = {
  name: string;
  id: string;
  description: string | null;
  typeId: number;
  breed: string;
  age: string;
  story: string | null;
  behavior: string | null;
  vaccines: string[];
  size: AnimalSize;
  sex: AnimalSex;
  photos: string[];
  status: AnimalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAnimalInput = {
  name: string;
  typeId: number;
  breed: string;
  age: string;
  description?: string | null;
  story?: string | null;
  behavior?: string | null;
  vaccines?: string[];
  size: "Pequeno" | "Medio" | "Grande";
  sex: "Macho" | "Femea";
  photos?: string[];
  status?: "Disponivel" | "Adotado";
};