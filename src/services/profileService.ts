import { Profile } from '../models/Profile';
import {
  createProfile,
  findByEmail,
  findByCpf,
  getById,
  getAll,
  updateProfile,
  deleteProfile,
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

export const getProfileByIdService = async (id: number) => {
  const profile = await getById(id);

  if (!profile) {
    throw new Error('profile not found');
  }

  return profile;
};

export const getAllProfilesService = async () => {
  const profiles = await getAll();
  return profiles;
};

export const updateProfileService = async (
  id: number,
  updates: Partial<Profile>
) => {
  const profile = await getById(id);

  if (!profile) {
    throw new Error('profile not found');
  }

  const affectedRows = await updateProfile(id, updates);

  if (affectedRows === 0) {
    throw new Error('failed to update profile');
  }

  return { message: 'profile updated' };
};

export const deleteProfileService = async (id: number) => {
  const profile = await getById(id);

  if (!profile) {
    throw new Error('profile not found');
  }

  await deleteProfile(id);

  return { message: 'profile deleted successfully' };
};
