const fetch = require("node-fetch");
const helpers = require("@turf/helpers");
const turf = require("@turf/turf");

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

module.exports = (lat, lng) => {
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
    startDate: "2020-11-01 00:00",
    endDate: "2020-11-01 00:10",
    // startDate,
    // endDate,
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

  return fetch(
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
        return -1;
      } else {
        const distance = getNearestDistance(pointsArr, lat, lng);
        return Math.round(distance);
      }
    })
    .catch((error) => {
      console.log(error);
      return -1;
    });
};
