import { Router } from 'express';
import usersRouter from './users.router.js';

const router = Router();

router.use('/users', usersRouter);
// router.use('/events', eventsRouter);
// router.use('/donations', donationsRouter);

export default router;
