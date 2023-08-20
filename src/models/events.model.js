import { promisePool } from '../db.js';

const eventsModel = {
  async create({ nombre, descripcion, fechaHora, ubicacion }) {
    try {
      const [data] = await promisePool.execute(
        `INSERT INTO eventos(nombre, descripcion, fecha_hora, ubicacion) 
         VALUES(?,?,?,?)`,
        [nombre, descripcion, fechaHora, ubicacion]
      );

      return data;
    } catch (error) {
      console.log(error);
      // if (error.code === 'ER_DUP_ENTRY') return 'Event already exists'; // nombre UNIQUE, opcional
      return null;
    }
  },

  async getAll() {
    try {
      const [rows] = await promisePool.query('SELECT * FROM eventos');
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getByYear(year) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT * FROM eventos WHERE fecha_hora LIKE CONCAT(?, '%')`,
        [year]
      );

      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getById(id) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT * FROM eventos WHERE id_evento = ?`,
        [id]
      );

      return rows[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export { eventsModel };
