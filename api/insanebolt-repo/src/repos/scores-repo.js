const pool = require("../pool");
const camelCase = require("../utils/camelCase");

class ScoresRepo {
  static async find() {
    const { rows } = await pool.query(
      "SELECT * FROM scores ORDER BY distance ASC LIMIT 10;"
    );

    return camelCase(rows);
  }

  static async insert(username, distance) {
    const {
      rows,
    } = await pool.query(
      `INSERT INTO scores (username, distance) VALUES ($1, $2) RETURNING *;`,
      [username, distance]
    );

    return camelCase(rows)[0];
  }

  static async findSBPosition(distance) {
    const {
      rows,
    } = await pool.query(
      `SELECT COUNT(*)+1 AS score_position FROM scores WHERE distance < $1`,
      [distance]
    );

    return camelCase(rows)[0];
  }
}

module.exports = ScoresRepo;
