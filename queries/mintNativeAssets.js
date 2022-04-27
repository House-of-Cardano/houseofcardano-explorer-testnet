// Contains the business logic for the API calls
const { execSync, exec } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const client = require("../util/cardano-db");

const Numbers = require("../mongodbClasses/luckyNumbers");

const query = require("../fetch/basicFetchQuery");
const db = require("../util/cardano-db");

const checkUTxO = require("../../cardanonode-js/processing/checkAddrUTxO");

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
  const walletID = req.query.walletID; // Wallet ID for the game wallet
  const addr = req.query.addr; // Wallet address for the game wallet

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
  const luckyNumbersDatumHash = Buffer.concat(buffer).toString();
  console.log("Lucky numbers dataum hashed");

  // console.log("Preparing data to mint the CMT...");

  // // Get the players address and also save all data to mongodb -> getting the player's address is a two-step process => first get the funded UTxO sitting at the game wallet, then get the input address that funded this UTxO

  const saveData = async () => {
    // Transaction hash comes from the fundning of the Game Wallet and allows the identification of the input wallet (players address)
    const queryAddrUrl = `http://167.86.98.239:8000/dbsync/cardano-explorer-queryAddr?addr=${addr}&isBank=no`;
    const transactionHashData = await query(queryAddrUrl);
    const transactionHash = transactionHashData[0].hash.substring(2);
    const fullTransactionHash =
      transactionHashData[0].hash.substring(2) +
      "#" +
      transactionHashData[0].index;
    console.log(`UTxO that was funded: ${transactionHash}`);
    console.log(`Full UTxO including index: ${fullTransactionHash}`);

    jsonFullTransactionHash = JSON.stringify(fullTransactionHash);
    fs.writeFileSync(
      "./data/fullTransactionHash.json",
      jsonFullTransactionHash,
      "utf8"
    );
    console.log("A json file has been saved (fullTransactionHash)");

    const transactionHashUrl = `http://167.86.98.239:8000/dbsync/get-user-wallet?transactionHash=\\x${transactionHash}`;
    const addressQuery = await query(transactionHashUrl);
    console.log("Finding player's address...");
    const playersAddr = async () => {
      for (let i = 0; i < addressQuery.length; i++) {
        if (addressQuery[i].address != addr) {
          playersAddrHome = addressQuery[i].address;
          return playersAddrHome;
        }
      }
    };
    const playersAddress = await playersAddr();
    console.log(`players: ${playersAddress}`);
    jsonPlayersAddress = JSON.stringify(playersAddress);
    fs.writeFileSync("./data/playersAddress.json", jsonPlayersAddress, "utf8");
    console.log("A json file has been saved (playersAddress)");

    console.log(`Player's address: ${playersAddress}`);

    const playersHomeAddress = fs.readFileSync(
      "./data/playersAddress.json",
      "utf8"
    );
    const gameWalletFullHash = fs.readFileSync(
      "./data/fullTransactionHash.json",
      "utf8"
    );

    console.log(
      `Players Home address: ${playersHomeAddress.replaceAll(/"/g, "")}`
    );
    console.log(
      `Game wallet full hash: ${gameWalletFullHash.replaceAll(/"/g, "")}`
    );

    // Save LN, wallet credentials and players wallet to mongoDB
    console.log("Saving play information to mongodb...");
    const number = new Numbers(
      luckyNumbers,
      jsonDatum,
      luckyNumbersDatumHash,
      walletID,
      addr,
      playersHomeAddress.replaceAll(/"/g, "")
    );
    number
      .save()
      .then((result) => {
        console.log("Saved game data");
        res.json();
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("Player's information saved to mongodb");

    // Mint the CMT

    console.log("Minting CMT...");
    process.chdir(
      "/home/node/HouseOfCardano/cardano-millions-testnet/cardanonode-js"
    );
    execSync(
      `node ../cardanonode-js/cardano-cli/mintCMT.js ${addr} ${gameWalletFullHash}`,
      { shell: "/bin/bash" }
    );
    process.chdir(
      "/home/node/HouseOfCardano/cardano-millions-testnet/houseofcardano-explorer-testnet"
    );
    console.log("CMT minted");

    console.log("Waiting for timer...");

    // Purchase the CMT
    console.log("Calculating game wallet available UTxO...");

    const getUTxO = async () => {
      const transactionHashData2 = await query(queryAddrUrl);
      console.log(transactionHashData2);
      const fullTransactionHash2 =
        transactionHashData2[0].hash.substring(2) +
        "#" +
        transactionHashData2[0].index;
      console.log(
        `Full UTxO including index: ${fullTransactionHash2.replaceAll(
          /"/g,
          ""
        )}`
      );

      jsonFullTransactionHash2 = JSON.stringify(fullTransactionHash2);
      fs.writeFileSync(
        "./data/fullTransactionHash2.json",
        jsonFullTransactionHash2,
        "utf8"
      );
      console.log("A json file has been saved (fullTransactionHash2)");
    };

    const runTransferFunction = () => {
      const gameWalletFullHash2 = fs.readFileSync(
        "./data/fullTransactionHash2.json",
        "utf8"
      );

      console.log(
        `Game wallet full hash: ${gameWalletFullHash2.replaceAll(/"/g, "")}`
      );

      console.log("Executing command...");
      console.log(`Lucky number hash: ${luckyNumbersDatumHash}`);
      console.log(
        `Player's address: ${playersHomeAddress.replaceAll(/"/g, "")}`
      );
      console.log(
        `Available hash on game wallet: ${gameWalletFullHash2.replaceAll(
          /"/g,
          ""
        )}`
      );
      console.log("This is the command that is being run...");
      console.log(
        `node cardano-cli/purchaseCMT.js ${luckyNumbersDatumHash.replace(
          /(\r\n|\n|\r)/gm,
          ""
        )} ${playersHomeAddress
          .replaceAll(/"/g, "")
          .replace(/(\r\n|\n|\r)/gm, "")} ${gameWalletFullHash2
          .replaceAll(/"/g, "")
          .replace(/(\r\n|\n|\r)/gm, "")}`
      );
      process.chdir(
        "/home/node/HouseOfCardano/cardano-millions-testnet/cardanonode-js"
      );
      console.log("Current directory: " + process.cwd());
      exec(
        `node cardano-cli/purchaseCMT.js ${luckyNumbersDatumHash.replace(
          /(\r\n|\n|\r)/gm,
          ""
        )} ${playersHomeAddress
          .replaceAll(/"/g, "")
          .replace(/(\r\n|\n|\r)/gm, "")} ${gameWalletFullHash2
          .replaceAll(/"/g, "")
          .replace(/(\r\n|\n|\r)/gm, "")}`
      );
      process.chdir(
        "/home/node/HouseOfCardano/cardano-millions-testnet/houseofcardano-explorer-testnet"
      );
      console.log("Current directory: " + process.cwd());
      console.log(
        `CMT transferred to your wallet ${playersHomeAddress.replaceAll(
          /"/g,
          ""
        )}`
      );
    };

    setTimeout(getUTxO, 120000);
    setTimeout(runTransferFunction, 130000);

    res.json({
      datum: luckyNumbers,
      jsonDatum: jsonDatum,
      hash: luckyNumbersDatumHash.replace(/(\r\n|\n|\r)/gm, ""),
      walletID: walletID,
      addr: addr,
      playersAddress: playersHomeAddress,
    });
  };
  saveData();
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
