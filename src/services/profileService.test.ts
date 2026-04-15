import { createProfileService } from '../services/profileService';
import * as repository from '../repositories/profileRepository';
import { Profile } from '../models/Profile';

jest.mock('../repositories/profileRepository');

const mockRepository = repository as jest.Mocked<
  typeof repository
>;

const validPessoaFisica: Profile = {
  type: 'fisica',
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

const validPessoaJuridica: Profile = {
  type: 'juridica',
  cnpj: '11222333000181',
  cpf: '11144477735',
  name: 'Empresa Exemplo',
  phone: '11999999999',
  email: 'empresa@example.com',
  confirmEmail: 'empresa@example.com',
  cep: '01452001',
  street: 'Av. Brigadeiro Faria Lima',
  number: '1853',
  city: 'São Paulo',
  neighborhood: 'Jardim Paulistano',
  state: 'SP',
  acceptedTerms: true,
};

describe('Profile Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfileService', () => {
    it('should create profile and return id for pessoa fisica', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(
        null
      );
      mockRepository.findByCpf.mockResolvedValueOnce(null);
      mockRepository.createProfile.mockResolvedValueOnce(1);

      const result = await createProfileService(
        validPessoaFisica
      );

      expect(result).toEqual({ id: 1 });
    });

    it('should create profile and return id for pessoa juridica', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(
        null
      );
      mockRepository.findByCpf.mockResolvedValueOnce(null);
      mockRepository.createProfile.mockResolvedValueOnce(2);

      const result = await createProfileService(
        validPessoaJuridica
      );

      expect(result).toEqual({ id: 2 });
    });

    it('should sanitize email before checking duplicates and saving', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(
        null
      );
      mockRepository.findByCpf.mockResolvedValueOnce(null);
      mockRepository.createProfile.mockResolvedValueOnce(1);

      await createProfileService({
        ...validPessoaFisica,
        email: '  JOAO@EXAMPLE.COM  ',
        confirmEmail: '  JOAO@EXAMPLE.COM  ',
      });

      expect(
        mockRepository.findByEmail
      ).toHaveBeenCalledWith('joao@example.com');
    });

    it('should throw error when email already exists', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce({
        id: 99,
      } as any);

      await expect(
        createProfileService(validPessoaFisica)
      ).rejects.toThrow('email already registered');
    });

    it('should throw error when cpf already exists', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(
        null
      );
      mockRepository.findByCpf.mockResolvedValueOnce({
        id: 99,
      } as any);

      await expect(
        createProfileService(validPessoaFisica)
      ).rejects.toThrow('cpf already registered');
    });

    it('should throw validation error when schema is invalid', async () => {
      await expect(
        createProfileService({
          ...validPessoaFisica,
          name: '',
        })
      ).rejects.toThrow('name is required');
    });

    it('should throw validation error when email does not match confirmEmail', async () => {
      await expect(
        createProfileService({
          ...validPessoaFisica,
          confirmEmail: 'other@example.com',
        })
      ).rejects.toThrow('emails do not match');
    });

    it('should throw validation error when cpf is invalid', async () => {
      await expect(
        createProfileService({
          ...validPessoaFisica,
          cpf: '00000000000',
        })
      ).rejects.toThrow('invalid cpf');
    });

    it('should throw validation error when cnpj is missing for pessoa juridica', async () => {
      await expect(
        createProfileService({
          ...validPessoaJuridica,
          cnpj: '',
        })
      ).rejects.toThrow(
        'cnpj is required for pessoa juridica'
      );
    });

    it('should not call repository when validation fails', async () => {
      await expect(
        createProfileService({
          ...validPessoaFisica,
          name: '',
        })
      ).rejects.toThrow();

      expect(
        mockRepository.findByEmail
      ).not.toHaveBeenCalled();
      expect(
        mockRepository.createProfile
      ).not.toHaveBeenCalled();
    });

    it('should not call createProfile when email is duplicate', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce({
        id: 99,
      } as any);

      await expect(
        createProfileService(validPessoaFisica)
      ).rejects.toThrow();

      expect(
        mockRepository.createProfile
      ).not.toHaveBeenCalled();
    });
  });
});
