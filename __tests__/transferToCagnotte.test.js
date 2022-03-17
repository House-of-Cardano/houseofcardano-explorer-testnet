const SimpleTransfer = require("../transactions/simpleTransfer");

describe("a transaction to transfer funds to cagnotte contains all the elements necessary to be validated", () => {
  networkMagic = "testnet-magic 1097911063";
  era = "alonzo-era";
  utxo = "";
  scriptFile = "./plutus-scripts/validate-payment.plutus";
  datumValue = 1970;
  redeemer = "./scripts/unit.json";
  txIn = "";
  changeAddress = "bank";
  protocolParams = "./blockchain/protocol.json";
  outFile = "./blockchain/transaction.tx";
  const simpleTransfer = new SimpleTransfer({
    networkMagic,
    era,
    utxo,
    scriptFile,
    datumValue,
    redeemer,
    txIn,
    changeAddress,
    protocolParams,
    outFile,
  });
  const minAdaValue = 1750000;
  it("has all of the elements that a simple transfer transaction needs", () => {
    expect(simpleTransfer.networkMagic).toEqual(networkMagic);
    expect(simpleTransfer.era).toEqual(era);
    expect(simpleTransfer.utxo).toEqual(utxo);
    expect(simpleTransfer.scriptFile).toEqual(scriptFile);
    expect(simpleTransfer.datumValue).toEqual(datumValue);
    expect(simpleTransfer.redeemer).toEqual(redeemer);
    expect(simpleTransfer.txIn).toEqual(txIn);
    expect(simpleTransfer.changeAddress).toEqual(changeAddress);
    expect(simpleTransfer.protocolParams).toEqual(protocolParams);
    expect(simpleTransfer.outFile).toEqual(outFile);
  });
  it("has sufficient funds", () => {
    expect(simpleTransfer.txIn).toBeGreaterThan(minAdaValue); // Need to confirm the toBeGreaterOrEqualThan assertion method and define the constant of minAdavalue with teh same name as in the cardano-millions-testnet repo
    toEqual("testnet-magic 1097911063");
  });
  it("is correctly signed", () => {
    expect(simpleTransfer.txIn).toBeGreaterThan(minAdaValue); // Need to confirm the toBeGreaterOrEqualThan assertion method and define the constant of minAdavalue with teh same name as in the cardano-millions-testnet repo
    toEqual("testnet-magic 1097911063");
  });
  it("is correctly submitted", () => {
    expect(simpleTransfer.txIn).toBeGreaterThan(minAdaValue); // Need to confirm the toBeGreaterOrEqualThan assertion method and define the constant of minAdavalue with teh same name as in the cardano-millions-testnet repo
    toEqual("testnet-magic 1097911063");
  });
});

// DO I NEED TO REMOVE THIS SECTION ON CARDANO-CLI COMMANDS TO ANOTHE REPO THAT ALSO RUNS ON THE NODE WITH MAKING GET REQUESTS TO THE EXPLORER SERVIER
// I WOULD SAY YES
// THE NODE IS THE EQUIVALENT OF THE 'MESSAGE BROKER' RUNNING ALL OF THESE SERVICES -> NODE, CARDANO-DB-SYNC, EXPLORER, API CALLS FROM ADMIN-CLIENT, CARDANO-CLI SERVICE

// How to mock calls to the blockchain to validate transactions? NEED A TICKET FOR THIS
