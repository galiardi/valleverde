import { promisePool } from '../db.js';

class RecordEvent {
  constructor({ id_event, id_user, trees }) {
    this.id_event = id_event;
    this.id_user = id_user;
    this.trees = trees;
  }

  async create() {
    try {
      const [result] = await promisePool.execute(
        'INSERT INTO record_event(id_event, id_user, trees) VALUES(?,?,?)',
        [this.id_event, this.id_user, this.trees]
      );

      return result;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return 'User or event not found';
      }
      if (error.code === 'ER_DUP_ENTRY')
        return 'User already registered on event'; // schema.sql CONSTRAINT event_user
      return null;
    }
  }
}

export { RecordEvent };
