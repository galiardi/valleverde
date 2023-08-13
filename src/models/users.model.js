import { promisePool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const usersModel = {
  async create({ nombre, apellido, rut, correo, contrasena, id_rol }) {
    try {
      const hashed_contrasena = await bcrypt.hash(contrasena, 10);

      const [result] = await promisePool.execute(
        'INSERT INTO usuarios (nombre, apellido, rut, correo, contrasena, id_rol) VALUES (?, ?, ?, ?, ?, ?);',
        [nombre, apellido, rut, correo, hashed_contrasena, id_rol]
      );

      return result;
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
        'SELECT * from usuarios WHERE correo = ?;',
        [correo]
      );
      if (!rows[0].contrasena) return false;

      // compara las contrasenas
      const hashed_contrasena = rows[0].contrasena;
      const passwordMatches = bcrypt.compare(contrasena, hashed_contrasena);
      if (!passwordMatches) return false;

      // crea un token
      const token = jwt.sign();
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export { usersModel };
