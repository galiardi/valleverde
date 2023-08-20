import { Router } from 'express';
import {
  registerUser,
  login,
  recoverPassword,
  updateUser,
} from '../../controllers/users.controller.js';
import { validateToken } from '../../middlewares/validateToken.js';
import { validateOwnership } from '../../middlewares/validateOwnership.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/recover-password', recoverPassword);
router.put('/:userId', validateToken, validateOwnership, updateUser);

export default router;
