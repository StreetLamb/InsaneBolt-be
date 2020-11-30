const pool = require("../pool");
const camelCase = require("../utils/camelCase");

class ScoresRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM scores;");

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
}

module.exports = ScoresRepo;
