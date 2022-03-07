const express = require('express');

const feedQuery = require('../controllers/query')

const router = express.Router();

router.get('/querydb', feedQuery.getQuery);

module.exports = router;