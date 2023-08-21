import { promisePool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';
import { sendEmail } from '../functions/sendEmail.js';
import { getRandomNumN } from '../functions/getRandomNum.js';
import { ROOT_KEY } from '../config.js';

class User {
  constructor({
    id_user = null,
    name,
    lastname,
    rut,
    email,
    password,
    root_key = null,
  }) {
    this.id_user = id_user;
    this.name = name;
    this.lastname = lastname;
    this.rut = rut;
    this.email = email;
    this.password = password;
    this.root_key = root_key;
    this.id_rol = root_key === ROOT_KEY ? 1 : 2; // si se provee root_key, se crea un administrador, si no, un usuario
  }

  async create() {
    try {
      const hashed_password = await bcrypt.hash(this.password, 10);

      const [result] = await promisePool.execute(
        'INSERT INTO users (name, lastname, rut, email, password, id_rol) VALUES (?, ?, ?, ?, ?, ?);',
        [
          this.name,
          this.lastname,
          this.rut,
          this.email,
          hashed_password,
          this.id_rol,
        ]
      );

      // crea un token
      this.id_user = result.insertId;
      delete this.password;
      delete this.root_key;
      const token = jwt.sign({ ...this }, TOKEN_KEY, { expiresIn: '1d' });
      jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        console.log(err, decoded);
      });
      return token;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') return 'Email already exists';
      return null;
    }
  }

  static async login({ email, password }) {
    try {
      // solicita el usuario a la base de datos
      const [rows] = await promisePool.execute(
        'SELECT id_user, name, lastname, rut, email, password, id_rol FROM users WHERE email = ?;',
        [email]
      );
      if (rows.length === 0) return false;

      // compara las passwords
      const hashed_password = rows[0].password;
      const passwordMatches = await bcrypt.compare(password, hashed_password);

      if (passwordMatches === false) return false;

      // crea un token
      delete rows[0].password;
      const token = jwt.sign(rows[0], TOKEN_KEY, { expiresIn: '1d' });

      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async recoverPassword(email) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM users WHERE email = ?;',
        [email]
      );
      if (rows.length === 0) return 'Email not found';

      // Creamos un password provisorio para enviar al cliente
      const tempPassword = String(getRandomNumN(6)); // numero aleatorio de 6 cifras (string)
      console.log(tempPassword);

      const [result] = await promisePool.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [tempPassword, email]
      );

      if (result.affectedRows !== 1) return null;

      await sendEmail({
        email: email,
        subject: 'Recuperacion de contrasena',
        message: `Su contrasena temporal es ${tempPassword}`,
      });

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update() {
    try {
      // actauliza el usuario
      const [result] = await promisePool.execute(
        `
        UPDATE users SET name = ?, lastname = ?, rut = ?, email = ?, password = ?, id_rol = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id_user = ?;`,
        [
          this.name,
          this.lastname,
          this.rut,
          this.email,
          this.password,
          this.id_rol,
          this.id_user,
        ]
      );

      if (result.affectedRows === 0) return 'User not found';

      return true;
    } catch (error) {
      console.log(error);
      // si el usuario quiere actualizar su email a un email que ya esta registrado (email UNIQUE)
      if (error.code === 'ER_DUP_ENTRY') return 'Email already exists';
      return null;
    }
  }

  // Para poder pedir la informacion del usuario cuando, por ejemplo, se quiera mandar un mail de confirmacion
  static async getUserById(id_user) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * from users WHERE id_usuario = ?',
        [id_user]
      );
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export { User };
