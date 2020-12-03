const express = require("express");
const scoresRepo = require("../repos/scores-repo");
const nearestDistance = require("../utils/nearestDistance");
const cors = require("cors");

const router = express.Router();

router.get("/scores/:limit?", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  const { limit } = req.params;
  const scores = await scoresRepo.find(limit);
  res.send(scores);
});

router.options("/scores", cors());
router.post("/scores", cors(), async (req, res) => {
  const { username, distance } = req.body;
  console.log(username, distance);
  const score = await scoresRepo.insert(username, distance);
  res.send(score);
});

router.options("/judgescore", cors());
router.post("/judgescore", cors(), async (req, res) => {
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
