// Contains the business logic for the API calls
const { execSync } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const client = require("../util/cardano-db");
const GameWallet = require('../wallets/createGameWallet');

const WALLET_PORT = 8090;

exports.testUrl = (req, res, next) => {
  const walletID = req.query.walletID;
  const buffer = [];
  const body = execSync(
    `curl --request GET \ --url http://167.86.98.239:${WALLET_PORT}/v2/wallets/${walletID}`
  );
  buffer.push(body);
  const data = Buffer.concat(buffer).toString();
  // console.log(JSON.parse(data));
  res.json({
    name: JSON.parse(data).name,
    funds: JSON.parse(data).balance.total.quantity,
  });
};

exports.createWallet = (req, res, next) => {
  // http://167.86.98.239:8000/query/create-wallet?name=test_3&recoverphrase=board+destroy+legal+assume+this+memory+forget+trigger+come+prison+alien+rack+jungle+deputy+result+battle+cabbage+labor+envelope+room+crawl+trumpet+ankle+spare
  const walletName = req.query.name;
  const recoveryPhrase = req.query.recoveryphrase; 
};

exports.isWalletReady = (req, res, next) => {
  async function subscribe() {
    const walletID = req.query.walletID;
    const buffer = [];
    const body = execSync(
      `curl --request GET \ --url http://167.86.98.239:${WALLET_PORT}/v2/wallets/${walletID} | jq ".state"`
    );
    buffer.push(body);
    const data = Buffer.concat(buffer).toString();
    if (JSON.parse(data).status == "ready") {
      console.log(`Status: ${JSON.parse(data).status}`);
      console.log(`Wallet ${walletID} is now ready for use`);
      res.json(JSON.parse(data).status)
    } else {
      console.log(`Wallet ${walletID} synchronising to the blockchain. This operation may take some time, please wait...`);
      console.log(`Status: ${JSON.parse(data).status}`);
      console.log(`${JSON.parse(data).progress.quantity}%`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await subscribe();
    }
  }
  subscribe();
};
