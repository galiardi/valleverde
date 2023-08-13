import { promisePool } from '../db.js';

const imagesModel = {
  async create({ color, grayscale, id_jewel }) {
    try {
      const [result] = await promisePool.execute(
        'INSERT INTO image (color_url, grayscale_url, id_jewel) values (?, ?, ?)',
        [color, grayscale, id_jewel]
      );
      console.log(result);
      if (result.affectedRows !== 1) return null;

      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  async delete(id_jewel) {
    try {
      const [result] = await promisePool.execute(
        'DELETE FROM image WHERE id_jewel = ?;',
        [id_jewel]
      );
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export { imagesModel };
