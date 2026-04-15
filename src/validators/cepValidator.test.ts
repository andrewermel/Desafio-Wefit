import { validateCEP } from '../validators/cepValidator';

describe('CEP Validator', () => {
  describe('validateCEP', () => {
    it('should accept a valid CEP without mask', () => {
      const result = validateCEP('01452001');
      expect(result).toBe(true);
    });

    it('should accept a valid CEP with mask', () => {
      const result = validateCEP('01452-001');
      expect(result).toBe(true);
    });

    it('should accept CEP starting with zero', () => {
      const result = validateCEP('01001000');
      expect(result).toBe(true);
    });

    it('should reject CEP with less than 8 digits', () => {
      const result = validateCEP('0145200');
      expect(result).toBe(false);
    });

    it('should reject CEP with more than 8 digits', () => {
      const result = validateCEP('014520011');
      expect(result).toBe(false);
    });

    it('should reject CEP with letters', () => {
      const result = validateCEP('0145200a');
      expect(result).toBe(false);
    });

    it('should reject CEP with invalid mask format', () => {
      const result = validateCEP('014520-01');
      expect(result).toBe(false);
    });

    it('should reject empty string', () => {
      const result = validateCEP('');
      expect(result).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validateCEP(null as any)).toBe(false);
      expect(validateCEP(undefined as any)).toBe(false);
    });

    it('should reject CEP with all zeros', () => {
      const result = validateCEP('00000000');
      expect(result).toBe(false);
    });
  });
});
