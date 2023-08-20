import { Router } from 'express';
import {
  registerUserOnEvent,
  createEvent,
  getAllEvents,
  getEventByYear,
} from '../../controllers/events.controller.js';
import { validateAdminToken } from '../../middlewares/validateAdminToken.js';
import { validateToken } from '../../middlewares/validateToken.js';

const router = Router();

router.post('/register', validateToken, registerUserOnEvent);
router.post('/create', validateAdminToken, createEvent);
router.get('/all', getAllEvents);
router.get('/:year', getEventByYear);

export default router;
