const express = require("express");
const fetch = require("node-fetch");
// import { nearestPoint } from "@turf/nearest-point";
// const distance = require("@turf/distance");
const helpers = require("@turf/helpers");
const turf = require("@turf/turf");

const router = express.Router();

const convertTime = (oldDateTime) => {
  return oldDateTime.replace(
    /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/g,
    (full, day, month, year, hour, minute) => {
      return `${year}-${month}-${day} ${hour}:${minute}`;
    }
  );
};

const getNearestDistance = (pointsArr, lat, lng) => {
  const points = helpers.featureCollection(pointsArr);
  const userPoint = helpers.point([lng, lat]);

  const nearest = turf.nearestPoint(userPoint, points);
  const dist = turf.distance(nearest, userPoint, { units: "meters" }); //converted to meters
  return dist;
};

router.post("/distance", async (req, res) => {
  const { lat, lng } = req.body;

  let options = {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  let formatter = new Intl.DateTimeFormat([], options);
  let endDate = formatter.format(new Date());
  let startDate = new Date();
  startDate = formatter.format(
    startDate.setMinutes(startDate.getMinutes() - 5)
  );

  endDate = convertTime(endDate);
  startDate = convertTime(startDate);

  //get all points from nea

  let raw = JSON.stringify({
    startDate,
    endDate,
    searchType: "dateTime",
  });

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  };

  fetch(
    "http://www.weather.gov.sg/lightning/HourlyDailyLightningStrikesServlet/",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      //find nearest point
      const pointsArr = !result.length
        ? result
        : result.map((e) => {
            const { latitude, longitude } = e;
            return helpers.point([longitude, latitude]);
          });
      //find distance from nearest point
      if (pointsArr.length === 0) {
        res.status(404).send("No lightning activity currently.");
      } else {
        const distance = getNearestDistance(pointsArr, lat, lng);
        console.log(distance);
        res.send({ distance });
      }
    })
    .catch((error) => console.log(error));
});

module.exports = router;
