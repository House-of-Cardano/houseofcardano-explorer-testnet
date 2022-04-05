const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const createWallets = require("../queries/createWallet");

const router = express.Router();

router.get(
  // http://167.86.98.239:8000/wallet/cardano-test?walletID=ad55217704b6e5071047f3bf95ee8f49fb0efa54
  "/cardano-test",
  createWallets.testUrl
);

router.get(
  "/create-wallet",
  createWallets.createWallet
  );
  
  router.post(
    "/save-wallet-credentials",
    createWallets.saveWalletCredentials
);

router.get(
  // http://167.86.98.239:8000/wallet/wallet-ready?walletID=ad55217704b6e5071047f3bf95ee8f49fb0efa54
  "/wallet-ready",
  createWallets.isWalletReady
);

module.exports = router;
