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

router.post(
  // http://167.86.98.239:8000/asset/lucky-numbers?num1=19&num2=29&num3=39&num4=49&num5=59&walletID=d2f8e81118089c39a24a62cd851bf00a334d5202&addr=addr_test1qr8px8xy5acc7mm40s5vckn5unssvx0wxkw8vnlwyl9gexgc8u0yys6k9ajrqje5nwj8pec34f8qkrk797zkmva83g5qafyhn6
  // CHANGE POSTMANT TO POST !!!
  // AND FUND GAME WALLET
  "/lucky-numbers",
  mintNativeAssets.luckyNumbers
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