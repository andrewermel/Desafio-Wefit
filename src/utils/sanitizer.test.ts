import {
  sanitizeString,
  sanitizeEmail,
  sanitizeCPF,
  sanitizeCNPJ,
  sanitizeCEP,
  sanitizePhone,
} from '../utils/sanitizer';

describe('Sanitizer', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should return empty string for null or undefined', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
    });

    it('should handle normal string', () => {
      expect(sanitizeString('hello')).toBe('hello');
    });
  });

  describe('sanitizeEmail', () => {
    it('should trim and lowercase email', () => {
      expect(sanitizeEmail('  USER@EXAMPLE.COM  ')).toBe(
        'user@example.com'
      );
    });

    it('should return empty string for null', () => {
      expect(sanitizeEmail(null as any)).toBe('');
    });
  });

  describe('sanitizeCPF', () => {
    it('should remove non-numeric characters', () => {
      expect(sanitizeCPF('111.444.777-35')).toBe(
        '11144477735'
      );
    });

    it('should return empty string for null', () => {
      expect(sanitizeCPF(null as any)).toBe('');
    });
  });

  describe('sanitizeCNPJ', () => {
    it('should remove non-numeric characters', () => {
      expect(sanitizeCNPJ('11.222.333/0001-81')).toBe(
        '11222333000181'
      );
    });

    it('should return empty string for null', () => {
      expect(sanitizeCNPJ(null as any)).toBe('');
    });
  });

  describe('sanitizeCEP', () => {
    it('should remove non-numeric characters', () => {
      expect(sanitizeCEP('01452-001')).toBe('01452001');
    });

    it('should return empty string for null', () => {
      expect(sanitizeCEP(null as any)).toBe('');
    });
  });

  describe('sanitizePhone', () => {
    it('should remove non-numeric characters', () => {
      expect(sanitizePhone('(11) 99999-9999')).toBe(
        '11999999999'
      );
    });

    it('should return empty string for null', () => {
      expect(sanitizePhone(null as any)).toBe('');
    });
  });
});
