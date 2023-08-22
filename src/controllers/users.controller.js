import { User } from '../models/user.model.js';

async function registerUser(req, res) {
  const response = {
    message: 'Register user',
    data: null,
    error: null,
  };

  // id_rol (ver user.model.js)
  const { name, lastname, rut, email, password } = req.body;
  if (!name || !lastname || !rut || !email || !password) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const user = new User(req.body);
  const result = await user.create();

  if (result === null) {
    response.error = 'Error registering user';
    return res.status(500).send(response);
  }

  if (result === 'Email already exists') {
    response.error = result;
    return res.status(409).send(response);
  }
  // el token en el body que el cliente lo guarde en el localhost para luego enviarlo en el header a la api
  // el token en las cookies es para leerlo antes de entrar a las rutas que renderizan las vistas
  // PENDIENTE decidir si trabajamos solo con el token en las cookies
  const token = result;
  response.data = { token };
  res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function login(req, res) {
  const response = {
    message: 'Login user',
    data: null,
    error: null,
  };

  const { email, password } = req.body;
  if (!email || !password) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const result = await User.login(req.body);

  if (result === null) {
    response.error = 'Error logging in user';
    return res.status(500).send(response);
  }

  if (result === false) {
    response.error = 'Invalid user or password';
    return res.status(401).send(response);
  }
  // el token en el body que el cliente lo guarde en el localhost para luego enviarlo en el header a la api
  // el token en las cookies es para leerlo antes de entrar a las rutas que renderizan las vistas
  // PENDIENTE decidir si trabajamos solo con el token en las cookies
  const token = result;

  response.data = { token };
  res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function recoverPassword(req, res) {
  const response = {
    message: 'Recover password',
    data: null,
    error: null,
  };

  const { email } = req.body;
  if (!email) {
    response.error = 'Missing required parameter';
    return res.status(400).send(response);
  }

  const result = await User.recoverPassword(email);

  if (result === null) {
    response.error = 'Error recovering password';
    return res.status(500).send(response);
  }

  if (result === 'User not found') {
    response.error = result;
    return res.status(404).send(response);
  }

  response.data = true;
  res.status(200).send(response);
}

async function updateUser(req, res) {
  const response = {
    message: 'Update user',
    data: null,
    error: null,
  };

  const { userId } = req.params;

  //valida existencia de parametros
  const { name, lastname, rut, email, password } = req.body;
  if (!name || !lastname || !rut || !email || !password) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const user = new User({ id_user: userId, ...req.body });
  const result = await user.update();

  if (result === null) {
    response.error = 'Error updating user';
    return res.status(500).send(response);
  }

  if (result === 'Email already exists') {
    response.error = result;
    return res.status(409).send(response);
  }

  if (result === 'User not found') {
    response.error = result;
    return res.status(400).send(response);
  }
  const token = result;
  response.data = { token };
  return res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

export { registerUser, login, recoverPassword, updateUser };
