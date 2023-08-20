import { promisePool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';
import { sendEmail } from '../functions/sendEmail.js';
import { getRandomNumN } from '../functions/getRandomNum.js';
import { ROOT_KEY } from '../config.js';

const usersModel = {
  async create(user) {
    const { nombre, apellido, rut, correo, contrasena, root_key } = user;

    let id_rol = 2; // usuario, valor por defecto
    // si se provee root_key, se creará un administrador
    if (root_key === ROOT_KEY) {
      id_rol = 1;
    }

    try {
      const hashed_contrasena = await bcrypt.hash(contrasena, 10);

      const [result] = await promisePool.execute(
        'INSERT INTO usuarios (nombre, apellido, rut, correo, contrasena, id_rol) VALUES (?, ?, ?, ?, ?, ?);',
        [nombre, apellido, rut, correo, hashed_contrasena, id_rol]
      );

      // crea un token sin pedir los datos a la base de datos
      user.id_user = result.insertId;
      user.id_rol = id_rol;
      delete user.contrasena;
      delete user.root_key;
      const token = jwt.sign(user, TOKEN_KEY, { expiresIn: '1d' });
      return token;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') return 'Email already exists';
      return null;
    }
  },

  async login({ correo, contrasena }) {
    try {
      // solicita la contrasena a la base de datos
      const [rows] = await promisePool.execute(
        'SELECT id_usuario, nombre, apellido, rut, correo, contrasena, id_rol FROM usuarios WHERE correo = ?;',
        [correo]
      );
      if (rows.length === 0) return false;

      // compara las contrasenas
      const hashed_contrasena = rows[0].contrasena;
      const passwordMatches = await bcrypt.compare(
        contrasena,
        hashed_contrasena
      );
      console.log('password matches: ', passwordMatches);
      if (passwordMatches === false) return false;

      // crea un token
      delete rows[0].contrasena;
      const token = jwt.sign(rows[0], TOKEN_KEY, { expiresIn: '1d' });

      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async recoverPassword(correo) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM usuarios WHERE correo = ?;',
        [correo]
      );
      if (rows.length === 0) return 'Email not found';

      // Para desencriptar la contrasena necesitamos la contrasena anterior, por lo que crearemos una contrasena provisoria.
      const tempPassword = String(getRandomNumN(6)); // numero aleatorio de 6 cifras (string)
      console.log(tempPassword);

      const [result] = await promisePool.execute(
        'UPDATE usuarios SET contrasena = ? WHERE correo = ?',
        [tempPassword, correo]
      );

      if (result.affectedRows !== 1) return null;

      await sendEmail({
        email: correo,
        subject: 'Recuperacion de contrasena',
        message: `Su contrasena temporal es ${tempPassword}`,
      });

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async update(userId, user) {
    const { nombre, apellido, rut, correo, contrasena, root_key } = user;

    let id_rol = 2; // usuario, valor por defecto
    // si se provee root_key, se creará un administrador
    if (root_key === ROOT_KEY) {
      id_rol = 1;
    }

    try {
      // actauliza el usuario
      const [result] = await promisePool.execute(
        `
        UPDATE usuarios SET nombre = ?, apellido = ?, rut = ?, correo = ?, contrasena = ?, id_rol = ?,
        fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_usuario = ?;`,
        [nombre, apellido, rut, correo, contrasena, id_rol, userId]
      );

      if (result.affectedRows === 0) return 'User not found';

      return true;
    } catch (error) {
      console.log(error);
      // si actualiza el correo a un correo que ya esta registrado. Correo es UNIQUE
      if (error.code === 'ER_DUP_ENTRY') return 'Email already exists';
      return null;
    }
  },

  // Para poder pedir la informacion del usuario cuando, por ejemplo, se quiera mandar un mail de confirmacion
  async getUserById(userId) {
    try {
      const [result] = await promisePool.execute(
        'SELECT * from usuarios WHERE id_usuario = ?',
        [userId]
      );
      if (result.length === 0) return null;
      return result[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export { usersModel };
