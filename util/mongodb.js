const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://HouseOfCardano:._v-YPDjqrUEQ44fTWHDN7Pt-rUoXftgcvoybMFjC.RkPPm2u@cluster0.vlfn9.mongodb.net/HouseOfCardano?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected to HouseOfCardano Mongodb");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
