import { validateEmail } from '../validators/emailValidator';

describe('Email Validator', () => {
  describe('validateEmail', () => {
    it('should accept a valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result).toBe(true);
    });

    it('should accept email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result).toBe(true);
    });

    it('should accept email with dots in local part', () => {
      const result = validateEmail(
        'first.last@example.com'
      );
      expect(result).toBe(true);
    });

    it('should accept email with plus sign in local part', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result).toBe(true);
    });

    it('should reject email without @ symbol', () => {
      const result = validateEmail('userexample.com');
      expect(result).toBe(false);
    });

    it('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result).toBe(false);
    });

    it('should reject email without local part', () => {
      const result = validateEmail('@example.com');
      expect(result).toBe(false);
    });

    it('should reject email without TLD', () => {
      const result = validateEmail('user@example');
      expect(result).toBe(false);
    });

    it('should reject email with spaces', () => {
      const result = validateEmail('user @example.com');
      expect(result).toBe(false);
    });

    it('should reject empty string', () => {
      const result = validateEmail('');
      expect(result).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });

    it('should reject email with double dots', () => {
      const result = validateEmail(
        'user..name@example.com'
      );
      expect(result).toBe(false);
    });
  });
});
