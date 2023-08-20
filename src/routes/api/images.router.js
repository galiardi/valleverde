import { Router } from 'express';
import {
  createImage,
  getImagesByEventId,
} from '../../controllers/images.controller.js';
import { validateAdminToken } from '../../middlewares/validateAdminToken.js';

const router = Router();

router.post('/', validateAdminToken, createImage);
router.get('/:eventId', getImagesByEventId);

export default router;
