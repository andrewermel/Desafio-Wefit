import {
  createProfile,
  findByEmail,
  findByCpf,
  getById,
  getAll,
  updateProfile,
  deleteProfile,
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

  describe('getById', () => {
    it('should return profile when id exists', async () => {
      const mockRow = {
        id: 42,
        cpf: '11144477735',
        email: 'joao@example.com',
        name: 'João',
      };
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[mockRow]]
      );

      const result = await getById(42);

      expect(result).toEqual(mockRow);
      expect(mockPool.execute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [42]
      );
    });

    it('should return null when id does not exist', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[]]
      );

      const result = await getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all profiles', async () => {
      const mockRows = [
        {
          id: 1,
          email: 'user1@example.com',
          cpf: '11144477735',
        },
        {
          id: 2,
          email: 'user2@example.com',
          cpf: '22244477735',
        },
      ];
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [mockRows]
      );

      const result = await getAll();

      expect(result).toEqual(mockRows);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no profiles exist', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[]]
      );

      const result = await getAll();

      expect(result).toEqual([]);
    });

    it('should call SELECT without WHERE clause', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [[]]
      );

      await getAll();

      const [sql] = (mockPool.execute as jest.Mock).mock
        .calls[0];
      expect(sql).toContain('SELECT');
      expect(sql).not.toContain('WHERE');
    });
  });

  describe('updateProfile', () => {
    it('should update profile and return affected rows', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ affectedRows: 1 }]
      );

      const updateData = { name: 'João Silva Updated' };
      const result = await updateProfile(42, updateData);

      expect(result).toBe(1);
      expect(mockPool.execute).toHaveBeenCalledTimes(1);
    });

    it('should call UPDATE with correct ID', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ affectedRows: 1 }]
      );

      await updateProfile(42, { name: 'João' });

      const [sql, values] = (mockPool.execute as jest.Mock)
        .mock.calls[0];
      expect(sql).toContain('UPDATE');
      expect(values).toContain(42);
    });

    it('should return 0 when profile not found', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ affectedRows: 0 }]
      );

      const result = await updateProfile(999, {
        name: 'Test',
      });

      expect(result).toBe(0);
    });
  });

  describe('deleteProfile', () => {
    it('should delete profile and return affected rows', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ affectedRows: 1 }]
      );

      const result = await deleteProfile(42);

      expect(result).toBe(1);
    });

    it('should call DELETE with correct ID', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ affectedRows: 1 }]
      );

      await deleteProfile(42);

      const [sql, values] = (mockPool.execute as jest.Mock)
        .mock.calls[0];
      expect(sql).toContain('DELETE');
      expect(values).toContain(42);
    });

    it('should return 0 when profile not found', async () => {
      (mockPool.execute as jest.Mock).mockResolvedValueOnce(
        [{ affectedRows: 0 }]
      );

      const result = await deleteProfile(999);

      expect(result).toBe(0);
    });
  });
});
