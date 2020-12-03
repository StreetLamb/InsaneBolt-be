const app = require("./src/app");
const pool = require("./src/pool");

pool
  .connect({
    connectionString:
      process.env.DATABASE_URL ||
      "postgres://jerronlim@localhost:5432/insanebolt",
    //delete this if using local database
    ssl: process.env.DATABASE_URL
      ? {
          rejectUnauthorized: false,
        }
      : false,
  })
  .then(() => {
    app().listen(process.env.PORT || 3007, () => {
      console.log(`Listening on port ${process.env.PORT || 3007}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
