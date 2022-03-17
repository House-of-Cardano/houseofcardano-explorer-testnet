const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const getInformation = require("../queries/query");
const db = require("../util/cardano-db");

const router = express.Router();

// const addr = "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc";
// const datumHash =
//   "\\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c";

// const querydb = {
//   text: "select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.data_hash::text, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.data_hash = $2",
//   values: [addr, datumHash],
// };

router.get("/cardano-explorer", async (req, res) => {
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
    console.log("JSON file has been saved.");
  });

  fs.readFile(
    filePath,
    // callback function that is called when reading file is done
    function (err, data) {
      // json data
      var jsonData = data;

      // parse json
      var jsonParsed = JSON.parse(jsonData);

      // access elements
      // console.log("Reading the individual UTxOs from the script address...")
      // for (let i = 0; i < jsonParsed.length; i++) {
      //   console.log(jsonParsed[i]);
      // };
      // console.log(jsonParsed[0][0]);
      // console.log(jsonParsed[0][1]);
      // console.log(jsonParsed[0][2]);
    }
  );
  res.send(rows);
});

router.get("/cardano-explorer-meta", async (req, res) => {
  const addr = req.query.addr;
  const datumHash = req.query.datumHash;
  const { rows } = await db.query({
    text: "select * from meta",
  });
  res.send(rows);
});

router.get('/cardano-explorer-build-submit-tx', getInformation.transferToCagnotte);

 
module.exports = router;
