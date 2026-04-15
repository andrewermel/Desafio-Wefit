import { validateCPF } from '../validators/cpfValidator';

describe('CPF Validator', () => {
  describe('validateCPF', () => {
    it('should accept a valid CPF', () => {
      const result = validateCPF('11144477735');
      expect(result).toBe(true);
    });

    it('should accept a formatted valid CPF', () => {
      const result = validateCPF('111.444.777-35');
      expect(result).toBe(true);
    });

    it('should reject CPF with all same digits', () => {
      const result = validateCPF('11111111111');
      expect(result).toBe(false);
    });

    it('should reject CPF with invalid check digit', () => {
      const result = validateCPF('11144477734');
      expect(result).toBe(false);
    });

    it('should reject CPF with less than 11 digits', () => {
      const result = validateCPF('1114447773');
      expect(result).toBe(false);
    });

    it('should reject CPF with more than 11 digits', () => {
      const result = validateCPF('111444777355');
      expect(result).toBe(false);
    });

    it('should reject empty string', () => {
      const result = validateCPF('');
      expect(result).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validateCPF(null as any)).toBe(false);
      expect(validateCPF(undefined as any)).toBe(false);
    });

    it('should reject CPF with invalid characters', () => {
      const result = validateCPF('111.444.777-3a');
      expect(result).toBe(false);
    });

    it('should reject another invalid CPF', () => {
      const result = validateCPF('10761934502');
      expect(result).toBe(false);
    });
  });
});
