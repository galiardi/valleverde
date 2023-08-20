import { promisePool } from '../db.js';

const registro_eventoModel = {
  async create({ id_evento, id_usuario, arboles_cantidad }) {
    try {
      const [result] = await promisePool.execute(
        'INSERT INTO registro_evento(id_evento, id_usuario, arboles_cantidad) VALUES(?,?,?)',
        [id_evento, id_usuario, arboles_cantidad]
      );

      return result;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return 'User or event not found';
      }
      if (error.code === 'ER_DUP_ENTRY')
        return 'User already registered on event'; // schema.sql CONSTRAINT evento_usuario
      return null;
    }
  },
};

export { registro_eventoModel };
