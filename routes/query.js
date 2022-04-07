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

router.get(
  "/cardano-test",
  getInformation.testUrl
);

router.get(
  "/create-wallet",
  getInformation.createWallet
);

router.get(
  "/wallet-ready",
  getInformation.isWalletReady
);

module.exports = router;
