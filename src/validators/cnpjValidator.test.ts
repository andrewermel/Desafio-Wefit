import { validateCNPJ } from '../validators/cnpjValidator';

describe('CNPJ Validator', () => {
  describe('validateCNPJ', () => {
    it('should accept a valid CNPJ', () => {
      const result = validateCNPJ('11222333000181');
      expect(result).toBe(true);
    });

    it('should accept a formatted valid CNPJ', () => {
      const result = validateCNPJ('11.222.333/0001-81');
      expect(result).toBe(true);
    });

    it('should reject CNPJ with all same digits', () => {
      const result = validateCNPJ('11111111111111');
      expect(result).toBe(false);
    });

    it('should reject CNPJ with invalid check digit', () => {
      const result = validateCNPJ('11222333000180');
      expect(result).toBe(false);
    });

    it('should reject CNPJ with less than 14 digits', () => {
      const result = validateCNPJ('112223330001');
      expect(result).toBe(false);
    });

    it('should reject CNPJ with more than 14 digits', () => {
      const result = validateCNPJ('112223330001811');
      expect(result).toBe(false);
    });

    it('should reject empty string', () => {
      const result = validateCNPJ('');
      expect(result).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validateCNPJ(null as any)).toBe(false);
      expect(validateCNPJ(undefined as any)).toBe(false);
    });

    it('should reject CNPJ with invalid characters', () => {
      const result = validateCNPJ('11.222.333/0001-8x');
      expect(result).toBe(false);
    });

    it('should reject another invalid CNPJ', () => {
      const result = validateCNPJ('00000000000000');
      expect(result).toBe(false);
    });
  });
});