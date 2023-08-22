import { promisePool } from '../db.js';

class Image {
  constructor({ image_url, description, id_event }) {
    this.image_url = image_url;
    this.description = description;
    this.id_event = id_event;
  }

  async create() {
    console.log(this);
    try {
      const [result] = await promisePool.execute(
        'INSERT INTO images (image_url, description, id_event) values (?, ?, ?)',
        [this.image_url, this.description, this.id_event]
      );

      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getImagesByEventId(id_event) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM images WHERE id_event = ?',
        [id_event]
      );
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export { Image };
