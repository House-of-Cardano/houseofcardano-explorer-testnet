const express = require('express');

const getInformation = require('../queries/query');
const db = require('../util/cardano-db');

const router = express.Router();

const addr = 'addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc';
const datumHash =  "\\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c";

const querydb = {
  text: 'select utxo_view.tx_id, utxo_view.address, utxo_view.value, tx.hash::text, tx_out.data_hash::text, tx.block_id from utxo_view inner join tx on tx.id = utxo_view.tx_id inner join tx_out on tx.id = tx_out.tx_id where utxo_view.address = $1 and tx_out.data_hash = $2',
  values: [addr, datumHash]
}

router.get('/cardano-explorer', async (req, res) => {
    const { rows } = await db.query(querydb)
    res.send(rows) 
  })

module.exports = router;