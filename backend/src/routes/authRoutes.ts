import { Router } from 'express';
import {
  changePassword,
  login,
  me,
  promoteUser,
  register,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/update-profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/promote/:userId', protect, adminOnly, promoteUser);

export default router;
