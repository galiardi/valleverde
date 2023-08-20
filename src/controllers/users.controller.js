import { usersModel } from '../models/users.model.js';

async function registerUser(req, res) {
  const response = {
    message: 'Register user',
    data: null,
    error: null,
  };

  // id_rol (ver usersModel)
  const { nombre, apellido, rut, correo, contrasena } = req.body;
  if (!nombre || !apellido || !rut || !correo || !contrasena) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const result = await usersModel.create(req.body);

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

  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const result = await usersModel.login(req.body);

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

  const { correo } = req.body;
  if (!correo) {
    response.error = 'Missing required parameter';
    return res.status(400).send(response);
  }

  const result = await usersModel.recoverPassword(correo);

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
  const { nombre, apellido, rut, correo, contrasena } = req.body;
  if (!nombre || !apellido || !rut || !correo || !contrasena) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const result = await usersModel.update(userId, req.body);

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

  response.data = true;
  return res.status(200).send(response);
}

export { registerUser, login, recoverPassword, updateUser };
