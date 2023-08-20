import { Router } from 'express';
import {
  createDonation,
  getDonationsByUserId,
} from '../../controllers/donations.controller.js';
import { validateToken } from '../../middlewares/validateToken.js';
import { validateOwnership } from '../../middlewares/validateOwnership.js';

const router = Router();

router.post('/', validateToken, createDonation);
router.get('/:userId', validateToken, validateOwnership, getDonationsByUserId);

export default router;
