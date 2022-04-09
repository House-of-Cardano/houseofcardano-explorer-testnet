const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const createWallets = require("../queries/createWallet");

const router = express.Router();

router.post(
  // http://167.86.98.239:8000/wallet/create-wallet?walletName=testWithPrivateKey&password=ZZZZZZZZZZZZ
  // IN POSTMAN CHANGE TO POST!!!
  "/create-wallet",
  createWallets.createWallet
);

router.get(
  // http://167.86.98.239:8000/wallet/wallet-funded?walletID=9955dbdcb821c1b4a49ba19481470e1656524274
  "/wallet-funded",
  createWallets.isWalletFunded
);

router.get(
  // http://167.86.98.239:8000/wallet/confirm-balance?walletAddress=addr_test1qqss0hu0rf8swsfazk4kqtqgcgcv76r242zj84s90g56a5ztuyg7ct46rn0gsu32m5a9mwjqhx64myg3f56xjhvnq6mq0vvm9g
  "/confirm-balance",
  createWallets.confirmBalance
);

module.exports = router;
