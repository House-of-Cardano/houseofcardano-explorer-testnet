const express = require('express');

const getInformation = require('../queries/query');
const db = require('../util/cardano-db');

const router = express.Router();

router.get('/query-db', getInformation.getQuery);

router.get('/cardano-db', async (req, res) => {
    const { rows } = await db.query('select * from meta')
    res.send(rows[0])
  })

module.exports = router;