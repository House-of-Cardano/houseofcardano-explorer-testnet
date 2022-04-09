// Contains the business logic for the API calls
const { execSync, exec } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const client = require("../util/cardano-db");

const Numbers = require("../mongodbClasses/luckyNumbers");

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

exports.luckyNumbers = (req, res, next) => {
  const num1 = req.query.num1;
  const num2 = req.query.num2;
  const num3 = req.query.num3;
  const num4 = req.query.num4;
  const num5 = req.query.num5;
  const walletID = req.query.walletID;
  const addr = req.query.addr;

  // Get lucky numders

  const luckyNumbers = [];
  luckyNumbers.push(
    parseInt(num1),
    parseInt(num2),
    parseInt(num3),
    parseInt(num4),
    parseInt(num5)
  );

  // Transform lucky numbers to json
  const map = new Map();

  map.set("key1", luckyNumbers[0]);
  map.set("key2", luckyNumbers[1]);
  map.set("key3", luckyNumbers[2]);
  map.set("key4", luckyNumbers[3]);
  map.set("key5", luckyNumbers[4]);

  const datum = {
    constructor: 0,
    fields: [
      { bytes: "416363657074" },
      { int: map.get("key1") },
      { int: map.get("key2") },
      { int: map.get("key3") },
      { int: map.get("key4") },
      { int: map.get("key5") },
    ],
  };

  const jsonDatum = JSON.stringify(datum);

  fs.writeFileSync("./data/datum.json", jsonDatum, "utf8");

  execSync(
    `cardano-cli transaction hash-script-data --script-data-file data/datum.json > data/datum_hash.json`
  );

  const hash = execSync("cat data/datum_hash.json");
  const buffer = [];
  buffer.push(hash);
  const dataHash = Buffer.concat(buffer).toString();
  console.log("Lucky numbers dataum hashed");

  // Save LN, wallet to mongoDB
  const number = new Numbers(luckyNumbers, jsonDatum, dataHash, walletID, addr);
  number
    .save()
    .then((result) => {
      console.log("Saved game data");
      res.json();
    })
    .catch((err) => {
      console.log(err);
    });

  res.json({
    datum: luckyNumbers,
    jsonDatum: jsonDatum,
    hash: dataHash.replace(/(\r\n|\n|\r)/gm, ""),
    walletID: walletID,
    addr: addr,
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
