const app = require("./src/app");
const pool = require("./src/pool");

pool
  .connect({
    host: "localhost",
    port: 5432,
    database: "insanebolt",
    user: "jerronlim",
    password: "mole",
  })
  .then(() => {
    app().listen(3007, () => {
      console.log("Listening on port 3007");
    });
  })
  .catch((err) => {
    console.log(err);
  });
