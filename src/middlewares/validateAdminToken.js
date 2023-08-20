import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

function validateAdminToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }
    // valida si es administrador (id_rol 1)
    console.log(decoded);
    console.log(Number(decoded.id_rol));
    if (decoded.id_rol != 1) {
      return res.status(403).send({ error: 'Not enough privileges' });
    }
    res.locals.user = decoded;
    next();
  });
}

export { validateAdminToken };
