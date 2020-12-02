const express = require("express");
const scoresRepo = require("../repos/scores-repo");
const nearestDistance = require("../utils/nearestDistance");

const router = express.Router();

router.get("/scores/:limit?", async (req, res) => {
  const { limit } = req.params;
  const scores = await scoresRepo.find(limit);
  res.send(scores);
});

router.post("/scores", async (req, res) => {
  const { username, distance } = req.body;
  const score = await scoresRepo.insert(username, distance);
  res.send(score);
});

router.post("/judgescore", async (req, res) => {
  const { lat, lng, period } = req.body;
  nearestDistance(lat, lng, period).then(async (distance) => {
    if (distance === -1) {
      res.send({ distance, position: -1 });
    } else {
      const { scorePosition } = await scoresRepo.findSBPosition(distance);
      res.send({ distance, scorePosition });
    }
  });
});

module.exports = router;
