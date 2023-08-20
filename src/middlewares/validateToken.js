import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

function validateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }
    res.locals.user = decoded;
    next();
  });
}

export { validateToken };
