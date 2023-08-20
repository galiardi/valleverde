import { Router } from 'express';
import usersRouter from './users.router.js';
import eventsRouter from './events.router.js';
import donationsRouter from './donations.router.js';
import imagesRouter from './images.router.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/events', eventsRouter);
router.use('/donations', donationsRouter);
router.use('/images', imagesRouter);

export default router;
