const io = require('socket.io-client'); 

const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const getInformation = require("../queries/query");
const db = require("../util/cardano-db");

// socket.io part -> acting as if it was a client
const socket = io("http://localhost:8000");
socket.on("connect", () => {
  console.log(`You connected with id: ${socket.id}`);
  socket.emit('test', 10, "Hi", {a: "a"});
});


const router = express.Router();

// const addr = "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc";
// const datumHash =
//   "\\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c";

// const querydb = {
//   text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.data_hash::text, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.data_hash = $2",
//   values: [addr, datumHash],
// };

router.get("/cardano-explorer-queryScriptAddr", async (req, res) => {
  // http://167.86.98.239:8000/query/cardano-explorer-queryScriptAddr?addr=addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc&datumHash=\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c
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
  // socket.emit("send-message", rows);
  socket.emit("send-message", rows[0].network_name);
  res.send(rows);
  socket.on("receive-message", message => {
    console.log(message);
  });
});

router.get(
  "/cardano-explorer-build-submit-tx",
  getInformation.buildTransaction
);

router.get("/cardano-explorer-queryAddr", async (req, res) => {
  // http://167.86.98.239:8000/query/cardano-explorer-queryAddr?addr=addr_test1vzc7magws73cel8lshw4yncmejylq4lutw2xx9ef02l70xs5jjjv5&isBank=yes
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

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-makepolicyfiles
  "/cardano-explorer-makepolicyfiles",
  getInformation.makePolicyFiles
);

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-chooseLuckyNumbers?num1=150&num2=250&num3=350&num4=450&num5=550
  "/cardano-explorer-chooseLuckyNumbers",
  getInformation.chooseLuckyNumbers
);

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-hashLuckyNumbers
  "/cardano-explorer-hashLuckyNumbers",
  getInformation.hashLuckyNumbers
);

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-mintCMT
  "/cardano-explorer-mintCMT",
  getInformation.mintCMT
);

router.get(
  // http://167.86.98.239:8000/query/cardano-test?walletID=4310a68dcaf86a627002fa988d15aba5428bbd82
  "/cardano-test",
  getInformation.testUrl
);

module.exports = router;
