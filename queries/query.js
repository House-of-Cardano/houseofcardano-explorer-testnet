// Contains the business logic for the API calls

const fs = require("fs");
const path = require("path");

const client = require("../util/cardano-db");

exports.getQuery = (req, res, next) => {
  res.json({
    query: [{ title: "First", content: "API Call" }],
  });
};

exports.buildTransaction = (req, res, next) => {
  res.json({
    query: [{ title: "First", content: "API Call" }],
  });
};

exports.luckyNumbers = (req, res, next) => {
  const num1 = req.query.num1;
  const num2 = req.query.num2;
  const num3 = req.query.num3;
  const num4 = req.query.num4;
  const num5 = req.query.num5;

  const luckyNumbers = [];
  luckyNumbers.push(parseInt(num1), parseInt(num2), parseInt(num3), parseInt(num4), parseInt(num5));

  jsonDatum = JSON.stringify(luckyNumbers);

  fs.writeFile("./data/datum", jsonDatum, "utf8", function (err) {
  if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
  }
  console.log("A json file has been saved");
  });
  res.json({
    query: [{ title: "Lucky Numbers", content: "200 OK" }],
  });
};
