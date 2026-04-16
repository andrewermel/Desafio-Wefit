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

  describe('getProfileByIdService', () => {
    it('should return profile when exists', async () => {
      const mockProfile = {
        id: 1,
        cpf: '11144477735',
        email: 'joao@example.com',
      };
      mockRepository.getById.mockResolvedValueOnce(
        mockProfile as any
      );

      const { getProfileByIdService } =
        await import('../services/profileService');
      const result = await getProfileByIdService(1);

      expect(result).toEqual(mockProfile);
    });

    it('should throw 404 error when profile not found', async () => {
      mockRepository.getById.mockResolvedValueOnce(null);

      const { getProfileByIdService } =
        await import('../services/profileService');

      await expect(
        getProfileByIdService(999)
      ).rejects.toThrow('profile not found');
    });
  });

  describe('getAllProfilesService', () => {
    it('should return all profiles', async () => {
      const mockProfiles = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];
      mockRepository.getAll.mockResolvedValueOnce(
        mockProfiles as any
      );

      const { getAllProfilesService } =
        await import('../services/profileService');
      const result = await getAllProfilesService();

      expect(result).toEqual(mockProfiles);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no profiles exist', async () => {
      mockRepository.getAll.mockResolvedValueOnce([]);

      const { getAllProfilesService } =
        await import('../services/profileService');
      const result = await getAllProfilesService();

      expect(result).toEqual([]);
    });
  });

  describe('updateProfileService', () => {
    it('should update profile successfully', async () => {
      mockRepository.getById.mockResolvedValueOnce({
        id: 1,
      } as any);
      mockRepository.updateProfile.mockResolvedValueOnce(1);

      const { updateProfileService } =
        await import('../services/profileService');
      const result = await updateProfileService(1, {
        name: 'João Updated',
      });

      expect(result).toEqual({
        message: 'profile updated',
      });
    });

    it('should throw error when profile not found for update', async () => {
      mockRepository.getById.mockResolvedValueOnce(null);

      const { updateProfileService } =
        await import('../services/profileService');

      await expect(
        updateProfileService(999, { name: 'Test' })
      ).rejects.toThrow('profile not found');
    });

    it('should not update if nothing was affected', async () => {
      mockRepository.getById.mockResolvedValueOnce({
        id: 1,
      } as any);
      mockRepository.updateProfile.mockResolvedValueOnce(0);

      const { updateProfileService } =
        await import('../services/profileService');

      await expect(
        updateProfileService(1, { name: 'Test' })
      ).rejects.toThrow('failed to update profile');
    });

    it('should allowed partial updates', async () => {
      mockRepository.getById.mockResolvedValueOnce({
        id: 1,
      } as any);
      mockRepository.updateProfile.mockResolvedValueOnce(1);

      const { updateProfileService } =
        await import('../services/profileService');
      const result = await updateProfileService(1, {
        name: 'Only Name Updated',
      });

      expect(result).toBeDefined();
      expect(
        mockRepository.updateProfile
      ).toHaveBeenCalledWith(1, {
        name: 'Only Name Updated',
      });
    });
  });

  describe('deleteProfileService', () => {
    it('should delete profile successfully', async () => {
      mockRepository.getById.mockResolvedValueOnce({
        id: 1,
      } as any);
      mockRepository.deleteProfile.mockResolvedValueOnce(1);

      const { deleteProfileService } =
        await import('../services/profileService');
      const result = await deleteProfileService(1);

      expect(result).toEqual({
        message: 'profile deleted successfully',
      });
    });

    it('should throw error when profile not found for deletion', async () => {
      mockRepository.getById.mockResolvedValueOnce(null);

      const { deleteProfileService } =
        await import('../services/profileService');

      await expect(
        deleteProfileService(999)
      ).rejects.toThrow('profile not found');
    });

    it('should call deleteProfile with correct id', async () => {
      mockRepository.getById.mockResolvedValueOnce({
        id: 42,
      } as any);
      mockRepository.deleteProfile.mockResolvedValueOnce(1);

      const { deleteProfileService } =
        await import('../services/profileService');
      await deleteProfileService(42);

      expect(
        mockRepository.deleteProfile
      ).toHaveBeenCalledWith(42);
    });
  });
});
