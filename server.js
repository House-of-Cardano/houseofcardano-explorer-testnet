const express = require('express');
const bodyParser = require('body-parser');

const queryDB = require('./routes/queryDbSync');
const createWallet = require('./routes/createWallet');
const mintNativeAssets = require('./routes/mintNativeAssets');

const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/dbsync', queryDB);
app.use('/wallet', createWallet);
app.use('/asset', mintNativeAssets);

module.exports = app;