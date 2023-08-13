import { Router } from 'express';
import {
  createImage,
  // getAllImages,
  // getImage,
  updateImage,
  // deleteImage,
} from './src/controllers/images.controller.js';

const router = Router();

router.post('/', createImage);
// router.get('/', getAllImages);
// router.get('/:id', getImage);
router.put('/:id', updateImage);
// router.delete('/:id', deleteImage);

export default router;
