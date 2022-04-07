const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const mintNativeAssets = require("../queries/mintNativeAssets");

const router = express.Router();

router.get(
  // http://167.86.98.239:8000/asset/makepolicyfiles
  "/makepolicyfiles",
  mintNativeAssets.makePolicyFiles
);

router.get(
  // http://167.86.98.239:8000/asset/chooseLuckyNumbers?num1=150&num2=250&num3=350&num4=450&num5=550
  "/chooseLuckyNumbers",
  mintNativeAssets.chooseLuckyNumbers
);

router.get(
  // http://167.86.98.239:8000/asset/hashLuckyNumbers
  "/hashLuckyNumbers",
  mintNativeAssets.hashLuckyNumbers
);

router.get(
  // http://167.86.98.239:8000/asset/mintCMT
  "/mintCMT",
  mintNativeAssets.mintCMT
);

module.exports = router;