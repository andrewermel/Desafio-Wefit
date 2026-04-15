import {
  createProfile,
  findByEmail,
  findByCpf,
} from '../repositories/profileRepository';
import pool from '../database/connection';
import { Profile } from '../models/Profile';

jest.mock('../database/connection', () => ({
  execute: jest.fn(),
}));

const mockPool = pool as jest.Mocked<typeof pool>;

const validProfile: Profile = {
  type: 'fisica',
  cpf: '11144477735',
  name: 'João da Silva',
  phone: '11999999999',
  email: 'joao@example.com',
  cep: '01452001',
  street: 'Rua das Flores',
  number: '100',
  city: 'São Paulo',
  neighborhood: 'Centro',
  state: 'SP',
  acceptedTerms: true,
};

describe('Profile Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    it('should insert profile and return generated id', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ insertId: 42 }]
      );

      const id = await createProfile(validProfile);

      expect(id).toBe(42);
      expect(mockPool.execute).toHaveBeenCalledTimes(1);
    });

    it('should call execute with correct SQL and values', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ insertId: 1 }]
      );

      await createProfile(validProfile);

      const [sql, values] = (mockPool.execute as jest.Mock)
        .mock.calls[0];
      expect(sql).toContain('INSERT INTO profiles');
      expect(values).toContain(validProfile.cpf);
      expect(values).toContain(validProfile.email);
    });

    it('should propagate database errors', async () => {
      (mockPool.execute as jest.Mock).mockRejectedValueOnce(
        new Error('DB connection failed')
      );

      await expect(
        createProfile(validProfile)
      ).rejects.toThrow('DB connection failed');
    });
  });

  describe('findByEmail', () => {
    it('should return profile when email exists', async () => {
      const mockRow = {
        id: 1,
        email: 'joao@example.com',
        cpf: '11144477735',
      };
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[mockRow]]
      );

      const result = await findByEmail('joao@example.com');

      expect(result).toEqual(mockRow);
    });

    it('should return null when email does not exist', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[]]
      );

      const result = await findByEmail(
        'notfound@example.com'
      );

      expect(result).toBeNull();
    });

    it('should query by email column', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[]]
      );

      await findByEmail('joao@example.com');

      const [sql, values] = (mockPool.execute as jest.Mock)
        .mock.calls[0];
      expect(sql).toContain('email');
      expect(values).toContain('joao@example.com');
    });
  });

  describe('findByCpf', () => {
    it('should return profile when cpf exists', async () => {
      const mockRow = { id: 1, cpf: '11144477735' };
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[mockRow]]
      );

      const result = await findByCpf('11144477735');

      expect(result).toEqual(mockRow);
    });

    it('should return null when cpf does not exist', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[]]
      );

      const result = await findByCpf('00000000000');

      expect(result).toBeNull();
    });

    it('should query by cpf column', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[]]
      );

      await findByCpf('11144477735');

      const [sql, values] = (mockPool.execute as jest.Mock)
        .mock.calls[0];
      expect(sql).toContain('cpf');
      expect(values).toContain('11144477735');
    });
  });
});
