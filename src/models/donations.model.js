import { promisePool } from '../db.js';

const donationsModel = {
  async create({ id_usuario, monto }) {
    try {
      const [data] = await promisePool.execute(
        `INSERT INTO donaciones(id_usuario, monto) 
         VALUES(?,?)`,
        [id_usuario, monto]
      );

      return data;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') return 'User not found';
      return null;
    }
  },

  async getDonationsByUserId(userId) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT * FROM donaciones WHERE id_usuario = ?`,
        [userId]
      );

      console.log(rows);

      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export { donationsModel };
