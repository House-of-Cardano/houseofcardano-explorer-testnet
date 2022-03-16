class BuildSubmitTransaction {
  constructor({
    networkMagic,
    era,
    UTxO,
    scriptFile,
    datumValue,
    redeemer,
    txIn,
    txOut,
    changeAddress,
    protocolParams,
    outFile,
  }) {
    this.networkMagic = networkMagic;
    this.era = era;
    this.UTxO = UTxo;
    this.scriptFile = scriptFile;
    this.datumValue = datumValue;
    this.redeemer = redeemer;
    this.txIn = txIn;
    this.txOut = txOut;
    this.changeAddress = changeAddress;
    this.protocolParams = protocolParams;
    this.outFile = outFile;
  }
}

module.exports = BuildSubmitTransaction;

fs.readFile(
    filePath,
    // callback function that is called when reading file is done
    function (err, data) {
      // json data
      var jsonData = data;

      // parse json
      var jsonParsed = JSON.parse(jsonData);

      // access elements
      // console.log("Reading the individual UTxOs from the script address...")
      // for (let i = 0; i < jsonParsed.length; i++) {
      //   console.log(jsonParsed[i]);
      // };
      // console.log(jsonParsed[0][0]);
      // console.log(jsonParsed[0][1]);
      // console.log(jsonParsed[0][2]);
    }
  );