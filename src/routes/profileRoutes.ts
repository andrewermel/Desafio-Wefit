import { Router } from 'express';
import { createProfileController } from '../controllers/profileController';

const router = Router();

router.post('/cadastro', createProfileController);

export default router;
