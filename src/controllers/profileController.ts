import { Request, Response } from 'express';
import { createProfileService } from '../services/profileService';

const CONFLICT_ERRORS = [
  'email already registered',
  'cpf already registered',
];

export const createProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await createProfileService(req.body);
    res.status(201).json({
      id: result.id,
      message: 'profile created successfully',
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'internal server error';

    if (CONFLICT_ERRORS.includes(message)) {
      res
        .status(409)
        .json({ error: message, code: 'CONFLICT' });
      return;
    }

    const knownValidationErrors = [
      'name is required',
      'phone is required',
      'invalid email',
      'emails do not match',
      'invalid cpf',
      'cnpj is required for pessoa juridica',
      'invalid cnpj',
      'invalid cep',
      'street is required',
      'number is required',
      'city is required',
      'neighborhood is required',
      'state is required',
      'terms must be accepted',
    ];

    if (knownValidationErrors.includes(message)) {
      res
        .status(400)
        .json({ error: message, code: 'VALIDATION_ERROR' });
      return;
    }

    res
      .status(500)
      .json({
        error: 'internal server error',
        code: 'INTERNAL_ERROR',
      });
  }
};
