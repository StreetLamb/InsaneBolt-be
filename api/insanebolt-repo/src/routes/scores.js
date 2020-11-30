const express = require("express");
const scoresRepo = require("../repos/scores-repo");

const router = express.Router();

router.get("/scores", async (req, res) => {
  const scores = await scoresRepo.find();
  res.send(scores);
});

router.post("/scores", async (req, res) => {
  const { username, distance } = req.body;
  const score = await scoresRepo.insert(username, distance);
  res.send(score);
});

module.exports = router;
