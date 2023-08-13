import { Router } from 'express';
import {
  validate,
  createJewel,
  getAllJewels,
  getJewel,
  updateJewel,
  deleteJewel,
} from '../controllers/jewels.controller.js';

const router = Router();

router.post('/', validate, createJewel);
router.get('/', getAllJewels);
router.get('/:id', getJewel);
router.put('/:id', updateJewel);
router.delete('/:id', deleteJewel);

export default router;
