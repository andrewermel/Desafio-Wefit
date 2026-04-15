const CEP_REGEX = /^\d{5}-?\d{3}$/;

export const validateCEP = (
  cep: string | null | undefined
): boolean => {
  if (!cep || typeof cep !== 'string') {
    return false;
  }

  if (!CEP_REGEX.test(cep)) {
    return false;
  }

  const cleanCEP = cep.replace('-', '');

  if (/^0{8}$/.test(cleanCEP)) {
    return false;
  }

  return true;
};
