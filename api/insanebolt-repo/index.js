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
    app().listen(process.env.PORT || 3007, () => {
      console.log(`Listening on port ${process.env.PORT || 3007}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
