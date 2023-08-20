import { Router } from 'express';
import { ifTokenSetUser } from '../../middlewares/ifTokenSetUser.js';

const router = Router();

// home // si usuario esta logeado modificamos el renderizado de la pagina (mainLayout.hbs)
router.get('/', ifTokenSetUser, (req, res) => {
  res.render('home', { layout: 'layouts/mainLayout' });
});

// login
router.get('/login', ifTokenSetUser, (req, res) => {
  if (req.locals?.user) {
    return res.redirect('/');
  }
  res.render('login', { layout: 'layouts/authLayout' });
});

// signup
router.get('/signup', ifTokenSetUser, (req, res) => {
  if (req.locals?.user) {
    return res.redirect('/');
  }
  res.render('signup', { layout: 'layouts/authLayout' });
});

// logout
router.get('/logout', (req, res) => {
  return res.clearCookie('access_token').redirect('/');
});

export default router;
