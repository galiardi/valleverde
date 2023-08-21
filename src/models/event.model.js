import { promisePool } from '../db.js';

class Event {
  constructor({ name, description, date_time, location }) {
    this.name = name;
    this.descripcion = description;
    this.date_time = date_time;
    this.location = location;
  }

  async create() {
    try {
      const [data] = await promisePool.execute(
        `INSERT INTO events(name, description, date_time, location) 
         VALUES(?,?,?,?)`,
        [this.name, this.descripcion, this.date_time, this.location]
      );

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getAll() {
    try {
      const [rows] = await promisePool.query('SELECT * FROM events');
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getEventByYear(year) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT * FROM events WHERE date_time LIKE CONCAT(?, '%')`,
        [year]
      );

      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getEventById(id_event) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT * FROM events WHERE id_event = ?`,
        [id_event]
      );

      return rows[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export { Event };
