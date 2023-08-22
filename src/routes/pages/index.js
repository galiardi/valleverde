import { Router } from 'express';
import { ifTokenSetUser } from '../../middlewares/ifTokenSetUser.js';
import { verifyUserToken } from '../../middlewares/verifyUserToken.js';

const router = Router();

// home // si usuario esta logeado modificamos el renderizado de la pagina (mainLayout.hbs)
router.get('/', ifTokenSetUser, (req, res) => {
  res.render('home', { title: 'Inicio', layout: 'layouts/mainLayout' });
});

// profile // si el token no es valido no permite entrar
router.get('/profile', verifyUserToken, (req, res) => {
  res.render('profile', { title: 'Mi perfil', layout: 'layouts/mainLayout' });
});

// gallery
router.get('/gallery', (req, res) => {
  res.render('gallery', { title: 'Galeria', layout: 'layouts/mainLayout' });
});

export default router;
