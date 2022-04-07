const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const db = require("../util/cardano-db");

const queryDB = require("../queries/query");
const router = express.Router();

// const addr = "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc";
// const datumHash =
//   "\\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c";

// const querydb = {
//   text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.data_hash::text, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.data_hash = $2",
//   values: [addr, datumHash],
// };

router.get("/cardano-explorer-queryScriptAddr", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/cardano-explorer-queryScriptAddr?addr=addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc&datumHash=\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c
  const addr = req.query.addr;
  const datumHash = req.query.datumHash;
  const { rows } = await db.query({
    text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.index, tx_out.data_hash::text, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.data_hash = $2",
    values: [addr, datumHash],
  });
  const scriptAddrUTxO = [];
  for (let i = 0; i < rows.length; i++) {
    scriptAddrUTxO.push([rows[i].hash, rows[i].index, rows[i].value]);
  }

  jsonScriptAddrUTxo = JSON.stringify(scriptAddrUTxO);
  const fileName = "scriptAddrUTxO";
  const filePath = path.join("data", fileName);

  fs.writeFile(filePath, jsonScriptAddrUTxo, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
    console.log("A json file has been saved");
  });

  fs.readFile(filePath, function (err, data) {
    var jsonData = data;
    var jsonParsed = JSON.parse(jsonData);
  });
  res.send(rows);
});

router.get("/cardano-explorer-meta", async (req, res) => {
  const { rows } = await db.query({
    text: "select * from meta",
  });
  res.send(rows);
});

router.get("/cardano-explorer-queryAddr", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/cardano-explorer-queryAddr?addr=addr_test1vzc7magws73cel8lshw4yncmejylq4lutw2xx9ef02l70xs5jjjv5&isBank=yes
  const addr = req.query.addr;
  const isBank = req.query.isBank;

  const { rows } = await db.query({
    text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.index, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.index = 0",
    values: [addr],
  });
  const addrUTxO = [];
  for (let i = 0; i < rows.length; i++) {
    addrUTxO.push([
      rows[i].address,
      rows[i].hash,
      rows[i].index,
      rows[i].value,
    ]);
  }

  if (isBank == "yes") {
    var fileName = "bankUTxO";
  } else {
    var fileName = "addrUTxO";
  }

  jsonUTxO = JSON.stringify(addrUTxO);
  const filePath = path.join("data", fileName);

  fs.writeFile(filePath, jsonUTxO, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
    console.log(`A json file ${fileName} has been saved`);
  });

  res.send(rows);
});

router.get("/check-balance", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/check-balance?addr=addr_test1qqss0hu0rf8swsfazk4kqtqgcgcv76r242zj84s90g56a5ztuyg7ct46rn0gsu32m5a9mwjqhx64myg3f56xjhvnq6mq0vvm9g
  const addr = req.query.addr;

  const { rows } = await db.query({
    text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.index, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.index = 0",
    values: [addr],
  });
  const addrUTxO = [];
  for (let i = 0; i < rows.length; i++) {
    addrUTxO.push([
      rows[i].address,
      rows[i].hash,
      rows[i].index,
      rows[i].value,
    ]);
  }
  const sumUTxO = [];
  for (let i = 0; i < rows.length; i++) {
    sumUTxO.push(parseInt(rows[i].value));
  }
  let sum = 0;
  for (let i = 0; i < sumUTxO.length; i++) {
    sum += sumUTxO[i];
  }
  res.send({ Transactions:rows, LovelaceBalance:sum, ADABalance:sum/1000000 });
  for (let i = 0; i < rows.length; i++) {
    console.log(
      `Address ${addr} contains the following balances: Transaction ID: ${rows[i].hash}, with balance: ${rows[i].value} Lovelace`
    );
  }
  console.log(`Total available funds at this address are: ${sum} Lovelace`);
  console.log(`Total available funds at this address are: ${sum / 1000000} ADA`);
  console.log(`Number of entries: ${rows.length}`);
});

router.get("/total-available-funds", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/total-available-funds?addr=addr_test1vzc7magws73cel8lshw4yncmejylq4lutw2xx9ef02l70xs5jjjv5
  const addr = req.query.addr;

  const { rows } = await db.query({
    text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.index, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.index = 0",
    values: [addr],
  });
  const sumUTxO = [];
  for (let i = 0; i < rows.length; i++) {
    sumUTxO.push(parseInt(rows[i].value));
  }
  let sum = 0;
  for (let i = 0; i < sumUTxO.length; i++) {
    sum += sumUTxO[i];
  }
  console.log(sum);

  res.json(sum);
});

router.get("/notify-change-in-balance", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/notify-change-in-balance?addr=addr_test1qqss0hu0rf8swsfazk4kqtqgcgcv76r242zj84s90g56a5ztuyg7ct46rn0gsu32m5a9mwjqhx64myg3f56xjhvnq6mq0vvm9g
  const addr = req.query.addr;
  const { rows } = await db.query({
    text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.index, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.index = 0",
    values: [addr],
  });
  const currentStatus = rows.length;
  console.log(currentStatus);
  console.log(rows.length);
  async function subscribe() {
    const { rows } = await db.query({
      text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.index, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.index = 0",
      values: [addr],
    });
    console.log(rows.length);
    console.log(currentStatus);
    if (currentStatus != rows.length) {
      console.log(`Your wallet ${addr} has been updated`);
      console.log(`Previous number of enttries: ${currentStatus}`);
      console.log(`New number of entries: ${rows.length}`);
      console.log(rows);
      res.send({ rows });
    } else {
      console.log(
        `Your wallet ${addr} has not yet been updated, please wait...`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await subscribe();
    }
  }
  subscribe();
});

module.exports = router;
