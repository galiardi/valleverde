import { Router } from 'express';
import { ifTokenSetUser } from '../../middlewares/ifTokenSetUser.js';

const router = Router();

// login
router.get('/login', ifTokenSetUser, (req, res) => {
  if (req.locals?.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login', layout: 'layouts/authLayout' });
});

// signup
router.get('/signup', ifTokenSetUser, (req, res) => {
  if (req.locals?.user) {
    return res.redirect('/');
  }
  res.render('signup', { title: 'Signup', layout: 'layouts/authLayout' });
});

// logout
router.get('/logout', (req, res) => {
  return res.clearCookie('access_token').redirect('/');
});

export default router;
