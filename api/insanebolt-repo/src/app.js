const express = require("express");
const scoresRouter = require("./routes/scores");
const distanceRouter = require("./routes/distance");

module.exports = () => {
  const app = express();
  app.use(express.json());
  app.use(scoresRouter);
  app.use(distanceRouter);

  return app;
};
