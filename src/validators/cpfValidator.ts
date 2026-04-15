export const validateCPF = (
  cpf: string | null | undefined
): boolean => {
  if (!cpf || typeof cpf !== 'string') {
    return false;
  }

  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cleanCPF)) {
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
    10, 9, 8, 7, 6, 5, 4, 3, 2,
  ];
  const secondDigitMultipliers = [
    11, 10, 9, 8, 7, 6, 5, 4, 3, 2,
  ];

  const firstCheckDigit = calculateCheckDigit(
    cleanCPF,
    firstDigitMultipliers
  );
  const secondCheckDigit = calculateCheckDigit(
    cleanCPF,
    secondDigitMultipliers
  );

  const calculatedCPF =
    cleanCPF.slice(0, 9) +
    firstCheckDigit +
    secondCheckDigit;

  return calculatedCPF === cleanCPF;
};
