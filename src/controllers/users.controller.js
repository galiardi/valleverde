import { usersModel } from '../models/users.model.js';

async function register(req, res) {
  const response = {
    message: 'Register user',
    data: null,
    error: null,
  };

  const { nombre, apellido, rut, correo, contrasena, id_rol } = req.body;
  if (!nombre || !apellido || !rut || !correo || !contrasena || !id_rol) {
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

  response.data = { insertId: result.insertId };
  res.status(201).send(response);
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
    response.error = 'Error logining user';
    return res.status(500).send(response);
  }

  response.data = { token: result.token };
  res.status(201).send(response);
}

// async function getAllusers(req, res) {
//   const response = {
//     data: null,
//     error: null,
//   };

//   const { name, material } = req.query;

//   let result;

//   if (name || material) {
//     result = await usersModel.getFiltered({ name, material });
//   } else {
//     result = await usersModel.getAll();
//   }

//   if (result === null) {
//     response.error = 'Error getting users';
//     return res.status(500).send(response);
//   }

//   result.forEach((jewel) => {
//     // HATOES
//     const links = getLinks({
//       host: req.headers.host,
//       route: 'users',
//       id: jewel.id_jewel,
//     });
//     jewel.links = links;
//   });

//   response.data = result;
//   return res.status(200).send(response);
// }

// async function getJewel(req, res) {
//   const response = {
//     data: null,
//     error: null,
//   };

//   const { id } = req.params;

//   const result = await usersModel.get(id);

//   if (result === false) {
//     response.error = 'Error getting jewel';
//     return res.staus(500).send(response);
//   }

//   // HATOES
//   const links = getLinks({
//     host: req.headers.host,
//     route: 'users',
//     id: result.id_jewel,
//   });
//   result.links = links;

//   response.data = result;
//   return res.status(200).send(response);
// }

// async function updateJewel(req, res) {
//   const response = {
//     data: null,
//     error: null,
//   };

//   const { id } = req.params;

//   const result = await usersModel.update(id, req.body);

//   if (result === null) {
//     response.error = 'Error updating jewel';
//     return res.status(500).send(response);
//   }

//   // HATOES
//   const links = getLinks({
//     host: req.headers.host,
//     route: 'users',
//     id: result.id_jewel,
//   });
//   result.links = links;

//   response.data = result;
//   return res.status(200).send(response);
// }

// async function deleteJewel(req, res) {
//   const response = {
//     data: null,
//     error: null,
//   };

//   const { id } = req.params;

//   const result = await usersModel.delete(id);

//   if (result === null) {
//     response.error = 'Error deleting jewel';
//     return res.status(500).send(response);
//   }

//   if (result.affectedRows === 0) {
//     response.error = 'Id not found';
//     return res.status(400).send(response);
//   }

//   response.data = result;
//   return res.status(200).send(response);
// }

export {
  register,
  login,
  // recoverPassword, updateUser
};
