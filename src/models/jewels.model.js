import { promisePool } from '../db.js';

const jewelsModel = {
  async create({ name, price, weight, materials }) {
    let conn = null;
    let output = null;

    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      const [result] = await conn.execute(
        'INSERT INTO jewel (name, price, weight) VALUES (?, ?, ?);',
        [name, price, weight]
      );

      for (const material of materials) {
        const [rows] = await conn.execute(
          'SELECT id_material FROM material WHERE name = ?;',
          [material]
        );
        const { id_material } = rows[0];
        await conn.execute(
          'INSERT INTO jewel_material (id_jewel, id_material) values (?,?)',
          [result.insertId, id_material]
        );
      }

      // selecciona la joya recien creada con sus respectivos materiales, para devolverla al cliente
      const createdJewel = await this.getData(conn, result.insertId);

      await conn.commit();
      output = createdJewel[0];
    } catch (error) {
      console.log(error);
      if (conn) await conn.rollback();
    } finally {
      if (conn) conn.release();
      return output;
    }
  },

  async getAll() {
    try {
      // obtiene todas las joyas con sus respectivos materiales
      const rows = this.getData(promisePool);

      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getFiltered({ name, material }) {
    try {
      // filtra por name,material o ambos
      const parameters = [];

      if (name) parameters.push(name);
      if (material) parameters.push(material);

      const [rows] = await promisePool.execute(
        `
      SELECT jewel.id_jewel, jewel.name, jewel.price, jewel.weight
      FROM jewel
      JOIN jewel_material ON jewel.id_jewel = jewel_material.id_jewel
      JOIN material ON jewel_material.id_material = material.id_material
      WHERE ${name ? 'jewel.name = ?' : 'TRUE'} AND ${
          material ? 'material.name = ?' : 'TRUE'
        }
      GROUP BY jewel.id_jewel;
      `,
        parameters
      );

      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async get(id) {
    try {
      // obtiene la joya con sus respectivos materiales, segun el id proporcionado
      const rows = await this.getData(promisePool, id);
      return rows[0];
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async update(id, { name, price, weight, materials }) {
    let conn = null;
    let output = null;

    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      // actualiza la tabla jewel
      const [result] = await conn.execute(
        'UPDATE jewel SET name = ?, price = ?, weight = ? WHERE id_jewel = ?;',
        [name, price, weight, id]
      );

      // borra los registros de jewel_material
      await conn.execute('DELETE FROM jewel_material WHERE id_jewel = ?;', [id]);

      // para cada material:
      for (const material of materials) {
        // obtiene el id del material
        const [rows] = await conn.execute(
          'SELECT id_material FROM material WHERE name = ?',
          [material]
        );

        const { id_material } = rows[0];

        // crea el registro en jewel_material
        await conn.execute(
          'INSERT INTO jewel_material (id_jewel, id_material) VALUES (?, ?);',
          [id, id_material]
        );
      }

      // obtiene la joya actualizada, para devolverla al cliente
      const updatedJewel = await this.getData(conn, id);

      await conn.commit();
      output = updatedJewel[0];
    } catch (error) {
      console.log(error);
      if (conn) await conn.rollback();
    } finally {
      if (conn) conn.release();
      return output;
    }
  },

  async delete(id) {
    let conn = null;
    let output = null;

    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      await conn.execute('DELETE FROM jewel_material WHERE id_jewel = ?;', [id]);
      const [result] = await conn.execute('DELETE FROM jewel WHERE id_jewel = ?;', [id]);

      await conn.commit();
      output = result;
    } catch (error) {
      console.log(error);
      if (conn) await conn.rollback();
    } finally {
      if (conn) conn.release();
      return output;
    }
  },

  async getData(conn, id = null) {
    const [rows] = await conn.execute(
      `
      SELECT jewel.id_jewel, jewel.name, jewel.price, jewel.weight, JSON_ARRAYAGG(material.name) AS materials
      FROM jewel
      JOIN jewel_material ON jewel.id_jewel = jewel_material.id_jewel
      JOIN material ON jewel_material.id_material = material.id_material
      ${id ? 'WHERE jewel.id_jewel = ?' : ''}
      GROUP BY jewel.id_jewel;
    `,
      [id]
    );

    return rows;
  },
};

export { jewelsModel };

/*
`
        SELECT
    j.id_jewel,
    j.name AS jewel_name,
    j.price,
    j.weight,
    STRING_AGG(m.name, ', ') AS materials
FROM
    jewel AS j
JOIN
    jewel_material AS jm ON j.id_jewel = jm.id_jewel
JOIN
    material AS m ON jm.id_material = m.id_material
WHERE
    j.id_jewel = (SELECT id_jewel FROM jewel WHERE name = 'jewel1')
GROUP BY
    j.id_jewel, j.name, j.price, j.weight;
        `
*/
