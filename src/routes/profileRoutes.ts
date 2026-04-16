import { Router } from 'express';
import {
  createProfileController,
  getProfileController,
  getAllProfilesController,
  updateProfileController,
  deleteProfileController,
} from '../controllers/profileController';

const router = Router();

router.post('/cadastro', createProfileController);
router.get('/profiles/:id', getProfileController);
router.get('/profiles', getAllProfilesController);
router.put('/profiles/:id', updateProfileController);
router.delete('/profiles/:id', deleteProfileController);

export default router;
