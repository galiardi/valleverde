import { Router } from 'express';
import {
  register,
  login,
  // recoverPassword,
  // updateUser,
} from '../../controllers/users.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
// router.post('/recover-password', recoverPassword);
// router.put('/:userId', updateUser);

export default router;
