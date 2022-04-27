const query = require("./fetch/basicFetchQuery");

const addr =
  "addr_test1qr8px8xy5acc7mm40s5vckn5unssvx0wxkw8vnlwyl9gexgc8u0yys6k9ajrqje5nwj8pec34f8qkrk797zkmva83g5qafyhn6";

const queryAddrUrl = `http://167.86.98.239:8000/dbsync/cardano-explorer-queryAddr?addr=${addr}&isBank=no`;

const getFundedUTxO = async () => {
  const transactionHash = await query(queryAddrUrl);
  console.log(transactionHash[0].hash.substring(2));

  const transactionHashUrl = `http://167.86.98.239:8000/dbsync/get-user-wallet?transactionHash=\\x${transactionHash}`;
  const playersAddress = await query(transactionHashUrl);
  console.log(`Player's address: ${playersAddress[0].address}`);
  const playersAddr = playersAddress[0].address;
};

getFundedUTxO();
