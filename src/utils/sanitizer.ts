export const sanitizeString = (
  value: string | null | undefined
): string => {
  if (!value || typeof value !== 'string') return '';
  return value.trim();
};

export const sanitizeEmail = (
  value: string | null | undefined
): string => {
  if (!value || typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

export const sanitizeCPF = (
  value: string | null | undefined
): string => {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\D/g, '');
};

export const sanitizeCNPJ = (
  value: string | null | undefined
): string => {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\D/g, '');
};

export const sanitizeCEP = (
  value: string | null | undefined
): string => {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\D/g, '');
};

export const sanitizePhone = (
  value: string | null | undefined
): string => {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\D/g, '');
};
