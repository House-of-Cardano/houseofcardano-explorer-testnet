// Contains the business logic for the API calls
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const Wallet = require("../mongodbClasses/createWallet");

const {
  NETWORK_PARAMETERS,
  MINTING_PARAMETERS,
  SCRIPT_ADDRESS_PARAMETERS,
  ADDRESSES,
} = require("../../cardanonode-js/config");

const WALLET_PORT = 8090;

exports.createWallet = (req, res, next) => {
  const walletName = req.query.walletName;
  const password = req.query.password;

  // Create recovery phrase
  const recoveryPhrase = execSync(
    `cardano-wallet recovery-phrase generate --size 24`
  );
  const buffer = [];
  buffer.push(recoveryPhrase);
  const dataRecoveryPhrase = Buffer.concat(buffer).toString();
  console.log(dataRecoveryPhrase);

  // Use recovery phrase to create the wallet and capture walletID as a variable
  const buffer2 = [];
  const walletCreation = execSync(
    `printf "${dataRecoveryPhrase} \n  \n ${password} \n ${password} \n" | cardano-wallet wallet create from-recovery-phrase ${walletName}`
  );
  buffer2.push(walletCreation);
  const data2 = Buffer.concat(buffer2).toString();
  const walletID = JSON.parse(data2).id;
  console.log(walletID);

  // Query address list and capture this as a list
  const buffer3 = [];
  const addresses = execSync(`cardano-wallet address list ${walletID}`);
  buffer3.push(addresses);
  const data3 = Buffer.concat(buffer3).toString();
  const addrListJson = JSON.parse(data3);

  const addrList = [];
  for (let i = 0; i < addrListJson.length; i++) {
    addrList.push(addrListJson[i].id);
  }
  execSync(". ./queries/checkSeedFileExists.sh");
  execSync("echo >> data/seed.txt");
  execSync(`echo "${dataRecoveryPhrase}" >> data/seed.txt`);

  // Create private signing key
  execSync(
    `cardano-wallet key from-recovery-phrase Shelley < data/seed.txt > data/root.prv`
  );
  execSync(
    `cardano-wallet key child 1852H/1815H/0H/0/0 < data/root.prv > data/payment.prv`
  );

  execSync(
    `cardano-cli key convert-cardano-address-key --shelley-payment-key --signing-key-file data/payment.prv --out-file data/payment.skey`
  );

  const privateKey = execSync("cat data/payment.skey");
  const bufferPrivateKey = [];
  bufferPrivateKey.push(privateKey);
  const dataPrivateKey = Buffer.concat(bufferPrivateKey).toString();
  console.log(dataPrivateKey);

  res.json({
    walletID: walletID,
    walletName: walletName,
    password: password,
    recoveryPhrase: dataRecoveryPhrase.replace(/(\r\n|\n|\r)/gm, ""),
    addr: addrList,
    privateKey: dataPrivateKey,
  });

  // Save wallet to mongoDB
  const wallet = new Wallet(
    walletID,
    walletName,
    password,
    dataRecoveryPhrase.replace(/(\r\n|\n|\r)/gm, ""),
    addrList,
    dataPrivateKey
  );
  wallet
    .save()
    .then((result) => {
      console.log("Created wallet");
      res.json();
    })
    .catch((err) => {
      console.log(err);
    });

  // Determine when wallet has synchronised to the blockchain
  async function subscribe() {
    const buffer = [];
    const body = execSync(
      `curl --request GET \ --url http://167.86.98.239:${WALLET_PORT}/v2/wallets/${walletID} | jq ".state"`
    );
    buffer.push(body);
    const data = Buffer.concat(buffer).toString();
    if (JSON.parse(data).status == "ready") {
      console.log(`Status: ${JSON.parse(data).status}`);
      console.log(`Wallet ${walletID} is now ready for use`);
      res.json(JSON.parse(data).status);
    } else {
      console.log(
        `Wallet ${walletID} synchronising to the blockchain. This operation may take some time, please wait...`
      );
      console.log(`Status: ${JSON.parse(data).status}`);
      console.log(`${JSON.parse(data).progress.quantity}%`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await subscribe();
    }
  }
  subscribe();
};

// Redundant???
exports.isWalletFunded = (req, res, next) => {
  const walletID = req.query.walletID;
  const buffer = [];
  const body = execSync(
    `curl --request GET \ --url http://167.86.98.239:${WALLET_PORT}/v2/wallets/${walletID}`
  );
  buffer.push(body);
  const data = Buffer.concat(buffer).toString();
  console.log(
    `Wallet ${walletID} currently contains ${
      JSON.parse(data).balance.total.quantity / 1000000
    } ADA`
  );
  res.json({
    name: JSON.parse(data).name,
    funds: JSON.parse(data).balance.total.quantity,
    currency: "Lovelace",
  });
};

// Redundant???
exports.confirmBalance = (req, res, next) => {
  const walletAddress = req.query.walletAddress;
  const buffer = [];
  const funds =
    execSync(`cardano-cli query utxo --address ${walletAddress} --${NETWORK_PARAMETERS.networkMagic}
  `);
  buffer.push(funds);
  const data = Buffer.concat(buffer).toString();
  console.log(data);
  res.json();
};
