import { promisePool } from '../db.js';

const imagesModel = {
  async create({ url_imagen, descripcion, id_evento }) {
    try {
      const [result] = await promisePool.execute(
        'INSERT INTO imagenes (url_imagen, descripcion, id_evento) values (?, ?, ?)',
        [url_imagen, descripcion || null, id_evento]
      );

      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  async getImagesByEventId(eventId) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM imagenes WHERE id_evento = ?',
        [eventId]
      );
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  // async delete(id_jewel) {
  //   try {
  //     const [result] = await promisePool.execute(
  //       'DELETE FROM image WHERE id_jewel = ?;',
  //       [id_jewel]
  //     );
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // },
};

export { imagesModel };
