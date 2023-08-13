import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { usersModel } from './src/models/usersModel.js';
import { TOKEN_KEY } from './src/config.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const response = {
    data: null,
    error: null,
  };

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    response.error = 'Mising required parameters';
    return res.status(400).send(response);
  }

  const result = await usersModel.create(req.body);

  if (result === null) {
    response.error = 'Error creating user';
    return res.status(500).send(response);
  }

  if (result === 'Email already exists') {
    response.error = result;
    return res.status(400).send(response);
  }

  console.log(result);

  jwt.sign(
    { ...req.body, id_user: result.insertId },
    TOKEN_KEY,
    {
      expiresIn: '1d',
    },
    (err, token) => {
      if (err) {
        console.log(err);
        response.error = 'Error generating token';
        return res.status(500).send(response);
      }
      response.data = { token };
      return res.status(201).send(response);
    }
  );
});

router.post('/login', (req, res) => {});

export default router;
