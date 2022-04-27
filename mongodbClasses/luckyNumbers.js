const getDb = require("../util/mongodb").getDb;

class LuckyNumnbers {
  constructor(luckyNumbers, jsonLuckyNumbers, hashedLuckyNumbers, walletID, addr, playerAddr) {
    this.luckyNumbers = luckyNumbers;
    this.jsonLuckyNumbers = jsonLuckyNumbers;
    this.hashedLuckyNumbers = hashedLuckyNumbers;
    this.walletID = walletID;
    this.addr = addr;
    this.playerAddr = playerAddr;
  }

  save() {
    const db = getDb();
    return db.collection("lucky-numbers")
      .insertOne(this)
      .then((result) => {
          console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = LuckyNumnbers;

