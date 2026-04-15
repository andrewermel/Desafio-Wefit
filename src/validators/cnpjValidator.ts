export const validateCNPJ = (
  cnpj: string | null | undefined
): boolean => {
  if (!cnpj || typeof cnpj !== 'string') {
    return false;
  }

  const cleanCNPJ = cnpj.replace(/\D/g, '');

  if (cleanCNPJ.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  const calculateCheckDigit = (
    digits: string,
    multipliers: number[]
  ): number => {
    let sum = 0;
    for (let i = 0; i < multipliers.length; i++) {
      sum += parseInt(digits[i]) * multipliers[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigitMultipliers = [
    5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
  ];
  const secondDigitMultipliers = [
    6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
  ];

  const firstCheckDigit = calculateCheckDigit(
    cleanCNPJ,
    firstDigitMultipliers
  );
  const secondCheckDigit = calculateCheckDigit(
    cleanCNPJ,
    secondDigitMultipliers
  );

  const calculatedCNPJ =
    cleanCNPJ.slice(0, 12) +
    firstCheckDigit +
    secondCheckDigit;

  return calculatedCNPJ === cleanCNPJ;
};
