import { validateProfileSchema } from '../utils/profileSchema';

describe('Profile Schema Validation', () => {
  const validPessoaJuridica = {
    type: 'juridica' as const,
    cnpj: '11222333000181',
    cpf: '11144477735',
    name: 'Empresa Exemplo',
    phone: '11999999999',
    telephone: '1133334444',
    email: 'empresa@example.com',
    confirmEmail: 'empresa@example.com',
    cep: '01452001',
    street: 'Av. Brigadeiro Faria Lima',
    number: '1853',
    complement: 'Andar P',
    city: 'São Paulo',
    neighborhood: 'Jardim Paulistano',
    state: 'SP',
    acceptedTerms: true,
  };

  const validPessoaFisica = {
    type: 'fisica' as const,
    cpf: '11144477735',
    name: 'João da Silva',
    phone: '11999999999',
    email: 'joao@example.com',
    confirmEmail: 'joao@example.com',
    cep: '01452001',
    street: 'Rua das Flores',
    number: '100',
    city: 'São Paulo',
    neighborhood: 'Centro',
    state: 'SP',
    acceptedTerms: true,
  };

  it('should accept a valid pessoa juridica payload', () => {
    const result = validateProfileSchema(
      validPessoaJuridica
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should accept a valid pessoa fisica payload', () => {
    const result = validateProfileSchema(validPessoaFisica);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject when name is missing', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      name: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('name is required');
  });

  it('should reject when email and confirmEmail do not match', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      confirmEmail: 'other@example.com',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('emails do not match');
  });

  it('should reject when email is invalid', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      email: 'invalid-email',
      confirmEmail: 'invalid-email',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('invalid email');
  });

  it('should reject when cpf is invalid', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      cpf: '00000000000',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('invalid cpf');
  });

  it('should reject when cnpj is required but missing for pessoa juridica', () => {
    const result = validateProfileSchema({
      ...validPessoaJuridica,
      cnpj: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'cnpj is required for pessoa juridica'
    );
  });

  it('should reject when cnpj is invalid for pessoa juridica', () => {
    const result = validateProfileSchema({
      ...validPessoaJuridica,
      cnpj: '11111111111111',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('invalid cnpj');
  });

  it('should reject when cep is invalid', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      cep: '0000000',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('invalid cep');
  });

  it('should reject when terms are not accepted', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      acceptedTerms: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'terms must be accepted'
    );
  });

  it('should reject when phone is missing', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      phone: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('phone is required');
  });

  it('should reject when street is missing', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      street: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('street is required');
  });

  it('should reject when state is missing', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      state: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('state is required');
  });

  it('should reject when number is missing', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      number: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('number is required');
  });

  it('should reject when city is missing', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      city: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('city is required');
  });

  it('should reject when neighborhood is missing', () => {
    const result = validateProfileSchema({
      ...validPessoaFisica,
      neighborhood: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'neighborhood is required'
    );
  });
});
