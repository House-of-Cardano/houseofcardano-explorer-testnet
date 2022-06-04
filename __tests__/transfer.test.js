rows = [
    {
      tx_id: "3656094",
      address:
        "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc",
      value: "4000000",
    },
    {
      tx_id: "3657177",
      address:
        "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc",
      value: "4000000",
    },
    {
      tx_id: "3657253",
      address:
        "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc",
      value: "4000000",
    },
    {
      tx_id: "3657302",
      address:
        "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc",
      value: "4000000",
    },
    {
      tx_id: "3657311",
      address:
        "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc",
      value: "4000000",
    },
    {
      tx_id: "3657320",
      address:
        "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc",
      value: "4000000",
    },
    {
      tx_id: "3657336",
      address:
        "addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc",
      value: "4000000",
    },
  ]

console.log(typeof rows)

const sumUTxO = [];
for (let i = 0; i < rows.length; i++) {
  sumUTxO.push(parseInt(rows[i].value));
}
console.log(sumUTxO);

let sum = 0;
for (let i = 0; i < sumUTxO.length; i++) {
  sum += sumUTxO[i];
}

const charity = 0.1 * sum;
const bank = 0.05 * sum;
const cagnotte = sum - charity - bank;

console.log(`Sum: ${sum}`);
console.log(`Charity: ${charity}`);
console.log(`Bank: ${bank}`);
console.log(`Cagnotte: ${cagnotte}`);

describe(`checkBalanceDatumHash`, () => {
  it("queries and extracts all UTxO carrying the correct datumHash", () => {
    expect(sum).toEqual(28000000);
  });
});

describe(`transferFromScriptAddr`, () => {
  it("transfers 10% of funds to charity", () => {
    expect(charity).toEqual(2800000);
  });
  it("transfers 5% of funds to bank", () => {
    expect(bank).toEqual(1400000);
  });
  it("transfers the remaining balance to cagnotte", () => {
    expect(cagnotte).toEqual(23800000);
  });
});
