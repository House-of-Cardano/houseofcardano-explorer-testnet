const getDb = require("../util/mongodb").getDb;

class WalletCredentials {
  constructor(walletID, walletName, password, recoveryPhrase, addr) {
    this.walletID = walletID;
    this.walletName = walletName;
    this.password = password;
    this.recoveryPhrase = recoveryPhrase;
    this.addr = addr;
  }

  save() {
    const db = getDb();
    return db.collection("wallets")
      .insertOne(this)
      .then((result) => {
          console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = WalletCredentials;
