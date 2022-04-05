const io = require('socket.io-client'); 

const fs = require("fs");
const path = require("path");

const express = require("express");
const querystring = require("querystring");

const mintNativeAssets = require("../queries/queryMintNativeAssets");
const db = require("../util/cardano-db");

// socket.io part -> acting as if it was a client
const socket = io("http://localhost:8000");
socket.on("connect", () => {
  console.log(`You connected with id: ${socket.id}`);
  socket.emit('test', 10, "Hi", {a: "a"});
});

const router = express.Router();

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-makepolicyfiles
  "/cardano-explorer-makepolicyfiles",
  mintNativeAssets.makePolicyFiles
);

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-chooseLuckyNumbers?num1=150&num2=250&num3=350&num4=450&num5=550
  "/cardano-explorer-chooseLuckyNumbers",
  mintNativeAssets.chooseLuckyNumbers
);

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-hashLuckyNumbers
  "/cardano-explorer-hashLuckyNumbers",
  mintNativeAssets.hashLuckyNumbers
);

router.get(
  // http://167.86.98.239:8000/query/cardano-explorer-mintCMT
  "/cardano-explorer-mintCMT",
  mintNativeAssets.mintCMT
);