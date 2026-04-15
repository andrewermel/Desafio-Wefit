import { Profile } from '../models/Profile';
import {
  createProfile,
  findByEmail,
  findByCpf,
} from '../repositories/profileRepository';
import { validateProfileSchema } from '../utils/profileSchema';
import {
  sanitizeEmail,
  sanitizeCPF,
  sanitizeCNPJ,
  sanitizeCEP,
  sanitizePhone,
  sanitizeString,
} from '../utils/sanitizer';

interface CreateProfileResult {
  id: number;
}

export const createProfileService = async (
  data: Profile
): Promise<CreateProfileResult> => {
  const sanitized: Profile = {
    ...data,
    name: sanitizeString(data.name),
    email: sanitizeEmail(data.email),
    confirmEmail: sanitizeEmail(data.confirmEmail),
    cpf: sanitizeCPF(data.cpf),
    cnpj: data.cnpj ? sanitizeCNPJ(data.cnpj) : undefined,
    cep: sanitizeCEP(data.cep),
    phone: sanitizePhone(data.phone),
    telephone: data.telephone
      ? sanitizePhone(data.telephone)
      : undefined,
    street: sanitizeString(data.street),
    number: sanitizeString(data.number),
    city: sanitizeString(data.city),
    neighborhood: sanitizeString(data.neighborhood),
    state: sanitizeString(data.state),
    complement: data.complement
      ? sanitizeString(data.complement)
      : undefined,
  };

  const validation = validateProfileSchema(sanitized);
  if (!validation.valid) {
    throw new Error(validation.errors[0]);
  }

  const existingEmail = await findByEmail(sanitized.email);
  if (existingEmail) {
    throw new Error('email already registered');
  }

  const existingCpf = await findByCpf(sanitized.cpf);
  if (existingCpf) {
    throw new Error('cpf already registered');
  }

  const id = await createProfile(sanitized);

  return { id };
};
