import { promisePool } from '../db.js';

class Donation {
  constructor({ id_user, quantity }) {
    this.id_user = id_user;
    this.quantity = quantity;
  }

  async create() {
    try {
      const [result] = await promisePool.execute(
        `INSERT INTO donations(id_user, quantity) 
         VALUES(?,?)`,
        [this.id_user, this.quantity]
      );

      return result;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') return 'User not found';
      return null;
    }
  }

  static async getDonationsByUserId(id_user) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT * FROM donations WHERE id_user = ?`,
        [id_user]
      );

      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export { Donation };
