import { Request, Response } from 'express';
import { createProfileController } from '../controllers/profileController';
import * as service from '../services/profileService';

jest.mock('../services/profileService');

const mockService = service as jest.Mocked<typeof service>;

const mockReq = (body: object): Partial<Request> => ({
  body,
});
const mockRes = (): {
  status: jest.Mock;
  json: jest.Mock;
} => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

describe('Profile Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 with id when profile is created successfully', async () => {
    mockService.createProfileService.mockResolvedValueOnce({
      id: 42,
    });

    const req = mockReq({ type: 'fisica', name: 'João' });
    const res = mockRes();

    await createProfileController(
      req as Request,
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 42,
      message: 'profile created successfully',
    });
  });

  it('should return 400 when service throws a validation error', async () => {
    mockService.createProfileService.mockRejectedValueOnce(
      new Error('name is required')
    );

    const req = mockReq({ type: 'fisica', name: '' });
    const res = mockRes();

    await createProfileController(
      req as Request,
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'name is required',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should return 409 when email is already registered', async () => {
    mockService.createProfileService.mockRejectedValueOnce(
      new Error('email already registered')
    );

    const req = mockReq({
      type: 'fisica',
      email: 'joao@example.com',
    });
    const res = mockRes();

    await createProfileController(
      req as Request,
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'email already registered',
      code: 'CONFLICT',
    });
  });

  it('should return 409 when cpf is already registered', async () => {
    mockService.createProfileService.mockRejectedValueOnce(
      new Error('cpf already registered')
    );

    const req = mockReq({
      type: 'fisica',
      cpf: '11144477735',
    });
    const res = mockRes();

    await createProfileController(
      req as Request,
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'cpf already registered',
      code: 'CONFLICT',
    });
  });

  it('should return 500 on unexpected errors', async () => {
    mockService.createProfileService.mockRejectedValueOnce(
      new Error('DB connection failed')
    );

    const req = mockReq({ type: 'fisica' });
    const res = mockRes();

    await createProfileController(
      req as Request,
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'internal server error',
      code: 'INTERNAL_ERROR',
    });
  });

  it('should call service with request body', async () => {
    mockService.createProfileService.mockResolvedValueOnce({
      id: 1,
    });

    const body = {
      type: 'fisica',
      name: 'João',
      cpf: '11144477735',
    };
    const req = mockReq(body);
    const res = mockRes();

    await createProfileController(
      req as Request,
      res as unknown as Response
    );

    expect(
      mockService.createProfileService
    ).toHaveBeenCalledWith(body);
  });

  describe('getProfileController', () => {
    it('should return 200 with profile data', async () => {
      const mockProfile = {
        id: 1,
        email: 'joao@example.com',
        cpf: '11144477735',
      };
      mockService.getProfileByIdService.mockResolvedValueOnce(
        mockProfile as any
      );

      const req = {
        params: { id: '1' },
      } as Partial<Request>;
      const res = mockRes();

      const { getProfileController } =
        await import('../controllers/profileController');
      await getProfileController(
        req as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfile);
    });

    it('should return 404 when profile not found', async () => {
      mockService.getProfileByIdService.mockRejectedValueOnce(
        new Error('profile not found')
      );

      const req = {
        params: { id: '999' },
      } as Partial<Request>;
      const res = mockRes();

      const { getProfileController } =
        await import('../controllers/profileController');
      await getProfileController(
        req as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getAllProfilesController', () => {
    it('should return 200 with all profiles', async () => {
      const mockProfiles = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];
      mockService.getAllProfilesService.mockResolvedValueOnce(
        mockProfiles as any
      );

      const req = {} as Partial<Request>;
      const res = mockRes();

      const { getAllProfilesController } =
        await import('../controllers/profileController');
      await getAllProfilesController(
        req as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        profiles: mockProfiles,
        total: 2,
      });
    });
  });

  describe('updateProfileController', () => {
    it('should return 200 on successful update', async () => {
      mockService.updateProfileService.mockResolvedValueOnce(
        {
          id: 1,
          name: 'João Updated',
          email: 'joao@example.com',
        } as any
      );

      const req = {
        params: { id: '1' },
        body: { name: 'João Updated' },
      } as Partial<Request>;
      const res = mockRes();

      const { updateProfileController } =
        await import('../controllers/profileController');
      await updateProfileController(
        req as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when profile not found for update', async () => {
      mockService.updateProfileService.mockRejectedValueOnce(
        new Error('profile not found')
      );

      const req = {
        params: { id: '999' },
        body: { name: 'Test' },
      } as Partial<Request>;
      const res = mockRes();

      const { updateProfileController } =
        await import('../controllers/profileController');
      await updateProfileController(
        req as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteProfileController', () => {
    it('should return 200 on successful deletion', async () => {
      mockService.deleteProfileService.mockResolvedValueOnce(
        {
          message: 'profile deleted successfully',
        }
      );

      const req = {
        params: { id: '1' },
      } as Partial<Request>;
      const res = mockRes();

      const { deleteProfileController } =
        await import('../controllers/profileController');
      await deleteProfileController(
        req as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when profile not found for deletion', async () => {
      mockService.deleteProfileService.mockRejectedValueOnce(
        new Error('profile not found')
      );

      const req = {
        params: { id: '999' },
      } as Partial<Request>;
      const res = mockRes();

      const { deleteProfileController } =
        await import('../controllers/profileController');
      await deleteProfileController(
        req as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
