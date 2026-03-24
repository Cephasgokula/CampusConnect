import { Router } from 'express';
import {
  cancelEvent,
  createEvent,
  deleteEvent,
  getAdminEventById,
  getAdminEvents,
  getEventById,
  getEvents,
  updateEvent
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getEvents);
router.get('/admin/all', protect, adminOnly, getAdminEvents);
router.get('/admin/:id', protect, adminOnly, getAdminEventById);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, upload.single('banner'), createEvent);
router.put('/:id', protect, adminOnly, upload.single('banner'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.put('/:id/cancel', protect, adminOnly, cancelEvent);

export default router;
