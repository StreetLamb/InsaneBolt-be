/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE scores (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        username VARCHAR(30) NOT NULL CHECK(COALESCE(TRIM(username), '') != ''),
        distance REAL NOT NULL
    );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE scores;
    `);
};
