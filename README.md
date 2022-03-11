[![ADA](https://img.shields.io/badge/Cardano-ADA-informational)](https://github.com/House-of-Cardano/cardano-millions-testnet)
[![Plutus](https://img.shields.io/badge/Cardano-Plutus-yellow)](https://github.com/House-of-Cardano/cardano-millions-testnet)
[![License](https://img.shields.io/github/license/house-of-cardano/cardano-millions-testnet)](https://github.com/House-of-Cardano/cardano-millions-testnet)
[![release](https://img.shields.io/badge/release-v0.0.1-9cf)](https://github.com/House-of-Cardano/cardano-millions-testnet)
[![donate](https://img.shields.io/badge/Donate-addr1q8zcfzrhkcdazlmxtfw77l3vfq5xmqmjx3nxj4vtwlsp2dqr55mdgpys5aml6mww9zyv0v98j2jmzjvgf583gwxnswrqcs920u-success)](https://github.com/House-of-Cardano/cardano-millions-testnet)

# houseofcardano-explorer-testnet
Backend server to query the Cardano blockchain (testnet)

## Introduction

The HouseOfCardano blockchain explorer is a backend server which can query the Cardano blockchain. This current instance of the explorer queries the Cardano testnet.

The explorer queries a cardano-db-sync instance that is synchronised to a cardano-node running the Cardano testnet. Instructions on how to set-up the cardano-db-sync and cardano-node can be found [here](https://github.com/House-of-Cardano/cardano-millions-testnet#install-and-run-a-cardano-db-sync-to-query-the-blockchain-1).

The explorer can query any of the information contained within the blockchain, but in the instance described here, it is making one unique GET request, to the cardano-millions lotto script address. 

Queries are made through the `node pg` package.

## Installation

For the explorer to work, it must query a server that is running both a [cardano-node](https://github.com/input-output-hk/cardano-node) and [cardano-db-sync](https://github.com/input-output-hk/cardano-db-sync). This latter is a postgres database that synchronises to the Cardano blockchain. Download this repo and adjust the connection settings to your cardano-db-sync postgres database by adjusting the settings in the `./util/cardano-db.js` file. Start the serice by running `npm start`, the API service will now be listening on port 8000. 

Currently, only one query is set up, which queries certain parametres of a certain address, and is exposed at the `'/cardano-explorer` endpoint. This query is located in the `routes/query.js` file. Custom sql queries can be set-up in this same file with unique endpoints exposed for the service to query other parametres of the Cardano blockchain. Queries can be fully automated, following the template that is given in this file. Care must be taken however, when hash values are used as either values to be queried or when returned as part of a query output.

Hash values in postgres are denoted with a `'\x'` tag. If a hash is to be used as a parameter of the query, then the `'\x'` character has to be escaped by the inclusion of an additional backslash, so the hash `'fac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c'` from the Cardano blockchain becomes `'\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c'` in postgres which must be altered to  `'\\xfac96da1bf190d85ae7e7a45b07b95826c3eb91b839564959d8411d4e0dc089c'`, to use in a query. Note the double backslash at the beginning of the hash.

If the hash is the result of a query, to maintain the hash format, I retrieve the data as a text field on the query, as in the example `select tx.hash::text from ...`

More information on hash values in postgres can be found [here](https://www.postgresql.org/docs/9.5/datatype-binary.html#AEN5806).

Project dependencies are listed in the `package.json` file and can be installed using the either the `npm install --save` or `npm install --save-dev` commands, the latter being used to install development only dependencies (such as nodemon, for example).

## Set-up for TDD

Import the `supertest` and `jest` testing environments:

``` markdown
npm install supertest jest @types/jest @types/supertest --save-dev
```

Setup a basic configuration file by running `jest --init` (perhaps need to run `npm install jest --global` first?).

Add `"test": "jest --watchAll"` to the `scripts` block of `package.json`

Run tests from the command line by running `npm run test`

## Ending remarks

If you have  enjoyed this project, please

Consider donating -> addr1q8zcfzrhkcdazlmxtfw77l3vfq5xmqmjx3nxj4vtwlsp2dqr55mdgpys5aml6mww9zyv0v98j2jmzjvgf583gwxnswrqcs920u :pray:

Consider staking on the HouseOfCardanoStakePool -> ticker [HOCSP] :fox_face:

#Peace, #Love, #Cardano #forall :hearts: