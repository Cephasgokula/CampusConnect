import { Router } from 'express';
import {
  cancelOwnRegistration,
  exportParticipantsCsv,
  getEventRegistrants,
  getMyRegistrations,
  markAttendance,
  registerForEvent
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly, studentOnly } from '../middleware/roleMiddleware.js';

const router = Router();

router.post('/:eventId', protect, studentOnly, registerForEvent);
router.delete('/:eventId', protect, studentOnly, cancelOwnRegistration);
router.get('/my', protect, studentOnly, getMyRegistrations);
router.get('/event/:eventId', protect, adminOnly, getEventRegistrants);
router.put('/:id/attend', protect, adminOnly, markAttendance);
router.get('/event/:eventId/export', protect, adminOnly, exportParticipantsCsv);

export default router;
