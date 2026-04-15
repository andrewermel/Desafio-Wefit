import { validateCPF } from '../validators/cpfValidator';
import { validateCNPJ } from '../validators/cnpjValidator';
import { validateEmail } from '../validators/emailValidator';
import { validateCEP } from '../validators/cepValidator';
import {
  sanitizeCPF,
  sanitizeCNPJ,
  sanitizeCEP,
  sanitizeEmail,
} from './sanitizer';

interface ProfilePayload {
  type: 'fisica' | 'juridica';
  cnpj?: string;
  cpf: string;
  name: string;
  phone: string;
  telephone?: string;
  email: string;
  confirmEmail: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  neighborhood: string;
  state: string;
  acceptedTerms: boolean;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateProfileSchema = (
  data: Partial<ProfilePayload>
): ValidationResult => {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('name is required');
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push('phone is required');
  }

  if (
    !data.email ||
    !validateEmail(sanitizeEmail(data.email))
  ) {
    errors.push('invalid email');
  }

  if (
    data.email &&
    data.confirmEmail &&
    sanitizeEmail(data.email) !==
      sanitizeEmail(data.confirmEmail)
  ) {
    errors.push('emails do not match');
  }

  if (!data.cpf || !validateCPF(sanitizeCPF(data.cpf))) {
    errors.push('invalid cpf');
  }

  if (data.type === 'juridica') {
    if (!data.cnpj || data.cnpj.trim() === '') {
      errors.push('cnpj is required for pessoa juridica');
    } else if (!validateCNPJ(sanitizeCNPJ(data.cnpj))) {
      errors.push('invalid cnpj');
    }
  }

  if (!data.cep || !validateCEP(sanitizeCEP(data.cep))) {
    errors.push('invalid cep');
  }

  if (!data.street || data.street.trim() === '') {
    errors.push('street is required');
  }

  if (!data.number || data.number.trim() === '') {
    errors.push('number is required');
  }

  if (!data.city || data.city.trim() === '') {
    errors.push('city is required');
  }

  if (
    !data.neighborhood ||
    data.neighborhood.trim() === ''
  ) {
    errors.push('neighborhood is required');
  }

  if (!data.state || data.state.trim() === '') {
    errors.push('state is required');
  }

  if (!data.acceptedTerms) {
    errors.push('terms must be accepted');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
