const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const db = require("../util/cardano-db");

const queryDB = require("../queries/query");
const { execSync } = require("child_process");
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
    console.log("A json file has been saved [Script Addr UTxO]");
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
  // http://167.86.98.239:8000/dbsync/cardano-explorer-queryAddr?addr=addr_test1qr8px8xy5acc7mm40s5vckn5unssvx0wxkw8vnlwyl9gexgc8u0yys6k9ajrqje5nwj8pec34f8qkrk797zkmva83g5qafyhn6&isBank=no
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
  // http://167.86.98.239:8000/dbsync/check-balance?addr=addr_test1qr8px8xy5acc7mm40s5vckn5unssvx0wxkw8vnlwyl9gexgc8u0yys6k9ajrqje5nwj8pec34f8qkrk797zkmva83g5qafyhn6
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
  res.send({
    Transactions: rows,
    LovelaceBalance: sum,
    ADABalance: sum / 1000000,
  });
  for (let i = 0; i < rows.length; i++) {
    console.log(
      `Address ${addr} contains the following balances: Transaction ID: ${rows[i].hash}, with balance: ${rows[i].value} Lovelace`
    );
  }
  console.log(`Total available funds at this address are: ${sum} Lovelace`);
  console.log(
    `Total available funds at this address are: ${sum / 1000000} ADA`
  );
  console.log(`Number of entries: ${rows.length}`);
});

router.get("/total-available-funds", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/total-available-funds?addr=addr_test1qrfjkhmgde2nk3wymyvwfnxpfcn69kfgy98pfsmpsj7hcc42tc995kgsakxjtfd58zsq64hg224uryqdjq35w4v98scsvw9u2h
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
  // http://167.86.98.239:8000/dbsync/notify-change-in-balance?addr=addr_test1qr8px8xy5acc7mm40s5vckn5unssvx0wxkw8vnlwyl9gexgc8u0yys6k9ajrqje5nwj8pec34f8qkrk797zkmva83g5qafyhn6
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

router.get("/historical-transaction-list", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/historical-transaction-list?addr=addr_test1qr8px8xy5acc7mm40s5vckn5unssvx0wxkw8vnlwyl9gexgc8u0yys6k9ajrqje5nwj8pec34f8qkrk797zkmva83g5qafyhn6
  const addr = req.query.addr;
  const { rows } = await db.query({
    text: "select tx.hash::text, tx_out.index, tx_out.value from tx inner join tx_out on tx_out.tx_id = tx.id where tx_out.address = $1",
    values: [addr],
  });
  res.send(rows);
});

router.get("/get-user-wallet", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/get-user-wallet?transactionHash=\xe687809f1b5feb0c8152ec5e10428e0f37286e5c8ed0b0153546bfececa86f06
  const transactionHash = req.query.transactionHash;
  const { rows } = await db.query({
    text: "select tx_out.address from tx_out inner join tx on tx_out.tx_id = tx.id where tx.hash = $1",
    values: [transactionHash],
  });
  res.send(rows);
});

router.get("/queryScriptAddrDatumHash", async (req, res) => {
  // http://167.86.98.239:8000/dbsync/queryScriptAddrDatumHash?addr=addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc&datumHash=\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c
  const addr = req.query.addr;
  const datumHash = req.query.datumHash;

  const { rows } = await db.query({
    text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.index, tx_out.data_hash::text, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.data_hash = $2",
    values: [addr, datumHash],
  });

  const addrUTxO = [];
  for (let i = 0; i < rows.length; i++) {
    addrUTxO.push([
      rows[i].address,
      rows[i].hash,
      rows[i].index,
      rows[i].value,
      rows[i].data_hash,
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
  for (let i = 0; i < rows.length; i++) {
    console.log(
      `Address -> ${addr} -> contains the following balances // Transaction ID: ${rows[i].hash}, with balance: ${rows[i].value} Lovelace`
    );
  }
  console.log(`Total available funds at this address are: ${sum} Lovelace`);
  console.log(
    `Total available funds at this address are: ${sum / 1000000} ADA`
  );
  console.log(`Number of entries: ${rows.length}`);

  const charity = 0.1 * sum;
  const bank = 0.05 * sum;
  const cagnotte = sum - charity - bank;

  console.log(`The charity account should receive: ${charity} Lovelace`);
  console.log(`The bank account should receive: ${bank} Lovelace`);
  console.log(`The cagnotte account should receive: ${cagnotte} Lovelace`);

  jsonaddrUTxO = JSON.stringify(addrUTxO);
  const fileName = "scriptAddrUTxOWithDatumHash.json";
  const filePath = path.join("data", fileName);

  console.log(typeof addrUTxO);
  console.log(typeof jsonaddrUTxO);

  fs.writeFileSync(filePath, jsonaddrUTxO, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
    console.log(
      "A json file has been saved [Script Addr UTxO with Datum Hash]"
    );
  });

  execSync(
    "cp ./data/scriptAddrUTxOWithDatumHash.json ../cardanonode-js/blockchain/scriptAddrUTxOWithDatumHash.json"
  );
  console.log("script addr UTxO list with datum hash copied to cardanonode-js");

  // Balance script addr by transferring proceeds to charity, bank and cagnotte

  console.log("Proceeding with transfer...");

  const transferFile = async () => {
    process.chdir(
      "/home/node/HouseOfCardano/cardano-millions-testnet/cardanonode-js"
    );
    execSync(
      `node cardano-cli/transferFromScriptAddr.js ${charity} ${cagnotte} ${bank}`,
      { shell: "/bin/bash" }
    );
    process.chdir(
      "/home/node/HouseOfCardano/cardano-millions-testnet/houseofcardano-explorer-testnet"
    );
    console.log("Transfer completed");
  };

  setTimeout(transferFile, 10000);

  res.send({
    Transactions: rows,
    LovelaceBalance: sum,
    ADABalance: sum / 1000000,
  });
});

module.exports = router;
