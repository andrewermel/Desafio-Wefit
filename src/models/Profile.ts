export interface Profile {
  id?: number;
  type: 'fisica' | 'juridica';
  cnpj?: string;
  cpf: string;
  name: string;
  phone: string;
  telephone?: string;
  email: string;
  confirmEmail?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  neighborhood: string;
  state: string;
  acceptedTerms: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileRow {
  id: number;
  type: 'fisica' | 'juridica';
  cnpj: string | null;
  cpf: string;
  name: string;
  phone: string;
  telephone: string | null;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  city: string;
  neighborhood: string;
  state: string;
  accepted_terms: number;
  created_at: Date;
  updated_at: Date;
}
