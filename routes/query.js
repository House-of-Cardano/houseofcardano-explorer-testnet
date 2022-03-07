const express = require('express');

const getInformation = require('../queries/query')

const router = express.Router();

router.get('/querydb', getInformation.getQuery);
router.get('/cardano', getInformation.getCardano);

module.exports = router;