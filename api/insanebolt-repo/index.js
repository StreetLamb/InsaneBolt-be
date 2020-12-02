const app = require("./src/app");
const pool = require("./src/pool");

pool
  .connect({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  .then(() => {
    app().listen(3007, () => {
      console.log("Listening on port 3007");
    });
  })
  .catch((err) => {
    console.log(err);
  });
