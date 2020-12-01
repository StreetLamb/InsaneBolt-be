const pool = require("../pool");
const camelCase = require("../utils/camelCase");

class DistanceRepo {
  static async checkScore(distance) {
    const {
      rows,
    } = await pool.query(
      `SELECT COUNT(*)+1 AS score_position FROM users WHERE distance > $1`,
      [distance]
    );

    return camelCase(rows)[0];
  }
}

module.exports = DistanceRepo;
