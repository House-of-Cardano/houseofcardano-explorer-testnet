// Contains the business logic for the API calls
const { execSync } = require("child_process");

const Wallet = require("../wallets/createWallet");

const WALLET_PORT = 8090;

exports.saveWalletCredentials = (req, res, next) => {
  const walletID = "31d546505906727bf56fd572e63c8fed56afb2b5";
  const walletName = "test_5";
  const password = "ZZZZZZZZZZZZZZZZZZZZZZZ";
  const recoveryPhrase =
    "dirt emotion pudding charge settle push behave gain impulse arm figure eyebrow tell knock rather enter poverty desk lounge depart run soup essence comfort";
  const addr = [
    "addr_test1qznpxcaj3ndmgunz7frwtgrtx5t6vjn4w8fkyyvcdnw59wy43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzys6d3juh",
    "addr_test1qq580ulxjnemlwvhkmwczrtxlgh3jm2kdvspf9842l6vmvv43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzys9fk39p",
    "addr_test1qzf586ynddphagcc9fn0mk8kq0czsnqevcqjxxenyvmxe2y43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysaeaw3n",
    "addr_test1qz72um5v8m4426t76urrn4rcul9lyw9f4fk338088cse40y43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysqzcvxr",
    "addr_test1qqtcjfuqkfa5s26m5jwnpd67nf8n2zzkd06r45c9xcu5pqy43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysp6mrty",
    "addr_test1qqrdfngtjtthq83kh9vsuj4x9etzrnukzwklyw43xzglfyy43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzyszpf965",
    "addr_test1qz5jsrjn2d6804h308ku2a7vy9s0pneqgcum2c3gdgqs4fu43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysvhlga7",
    "addr_test1qz9y2qf0ecza7vqcg4gc4qyl5vkrpltgk4jacje8f7qy8q543mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzys6lujsu",
    "addr_test1qrkwc6mcxvc6dddnwwndjfeh70lyersgcs4fhmum9q67xdu43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzystn293s",
    "addr_test1qzc7603s08k64tf3207mzyanjpvaz8dkhp9kp7tz398sveu43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysg3zgs0",
    "addr_test1qpd4y6pdnqnmcj63xuq9v8x0ja657sh0cy366kqy9gsfley43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzyskk2ccr",
    "addr_test1qqhe2j0jecj94d9pz6epcq6efdlyt65etf27xdqnlxykq9543mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysf8rlcj",
    "addr_test1qzjyfr0x2vu7l9hldekjxuv0qd4n0wrx7xglq7747332k7u43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzyspuaguq",
    "addr_test1qrf4uxp2jz6ag79ks5tanrjrnzrnucy3tresqupp6u290sv43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysq4cvl6",
    "addr_test1qrpm3jta9znls60yfgl7rmtyd2hu3p0cgn36wf9r0dzahtu43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysallh2l",
    "addr_test1qz24x0jcj0hc0e2cl7mgn7yua052h89egf3e48e5r006xgv43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzyszfyr3g",
    "addr_test1qrd4v873pr5gezvxy9re2knh0qpl70j8y68m2nlcgdxy2ky43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzyssgay88",
    "addr_test1qrjndzk4452ps9uzjnu8tdp5lvpj2740242e4z9d3rltlry43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzyst68mk3",
    "addr_test1qr85pe6mlaghag4d0048v6lmu99eztn34l80hl2mwrzyu8u43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzys4antvv",
    "addr_test1qpm68tkemy97a28yrr23gckkqee0x7w0g7a6s9f8zpxqcmu43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzyszhzak6",
    "addr_test1qp9qa503k8kk082al2fl6d265q7kffyad0mtsyetfdwwmnv43mj2fscdzxd5pc3cgs05mjpne74gt63rywd2dpg6tzysh5m6n7",
  ];
  const wallet = new Wallet(
    walletID,
    walletName,
    password,
    recoveryPhrase,
    addr
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
};

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
