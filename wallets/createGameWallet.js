const getDb = require("../util/mongodb").getDb;

class GameWallet {
  constructor(name, password, recoveryPhrase, addr) {
    this.name = name;
    this.password = password;
    this.recoveryPhrase = recoveryPhrase;
    this.addr = addr;
  }

  save() {
    const db = getDb();
    db.collection("gameAddress")
      .insertOne(this)
      .then((result) => {
          console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = GameWallet;
