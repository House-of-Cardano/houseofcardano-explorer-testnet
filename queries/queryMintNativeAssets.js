// Contains the business logic for the API calls
const { execSync } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const client = require("../util/cardano-db");

exports.makePolicyFiles = (req, res, next) => {
  process.chdir(
    "/home/node/HouseOfCardano/cardano-millions-testnet/cardanonode-js"
  );
  execSync("node ../cardanonode-js/cardano-cli/policy/makePolicyFiles.js");
  process.chdir(
    "/home/node/HouseOfCardano/cardano-millions-testnet/houseofcardano-explorer-testnet"
  );
  console.log("Policy files created");
  res.json({
    query: [{ title: "Policy Files", content: "200 OK" }],
  });
};

exports.chooseLuckyNumbers = (req, res, next) => {
  const num1 = req.query.num1;
  const num2 = req.query.num2;
  const num3 = req.query.num3;
  const num4 = req.query.num4;
  const num5 = req.query.num5;

  const luckyNumbers = [];
  luckyNumbers.push(
    parseInt(num1),
    parseInt(num2),
    parseInt(num3),
    parseInt(num4),
    parseInt(num5)
  );

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

exports.hashLuckyNumbers = (req, res, next) => {
  process.chdir(
    "/home/node/HouseOfCardano/cardano-millions-testnet/cardanonode-js"
  );
  execSync("node ../cardanonode-js/cardano-cli/CMT_datum/luckyNumbers.js");
  execSync("node ../cardanonode-js/cardano-cli/CMT_datum/hashCMTDatum.js");
  process.chdir(
    "/home/node/HouseOfCardano/cardano-millions-testnet/houseofcardano-explorer-testnet"
  );
  console.log("Lucky numbers dataum hashed");
  res.json({
    query: [{ title: "Lucky Numbers Datum is hashed", content: "200 OK" }],
  });
};

exports.mintCMT = (req, res, next) => {
  process.chdir(
    "/home/node/HouseOfCardano/cardano-millions-testnet/cardanonode-js"
  );
  execSync("node ../cardanonode-js/cardano-cli/mintCMT.js");
  process.chdir(
    "/home/node/HouseOfCardano/cardano-millions-testnet/houseofcardano-explorer-testnet"
  );
  console.log("CMT minted");
  res.json({
    query: [{ title: "CMT minted", content: "200 OK" }],
  });
};