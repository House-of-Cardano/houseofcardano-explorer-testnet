const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://HouseOfCardano:._v-YPDjqrUEQ44fTWHDN7Pt-rUoXftgcvoybMFjC.RkPPm2u@cluster0.vlfn9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected to HouseOfCardano Mongodb");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;