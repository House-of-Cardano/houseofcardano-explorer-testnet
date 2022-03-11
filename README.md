# houseofcardano-explorer-testnet
Backend server to query the Cardano blockchain (testnet)

## Set-up for TDD

Import `supertest` and `jest` testing environment:

``` markdown
npm install supertest jest @types/jest @types/supertest --save-dev
```

Setup a basic configuration file by running `jest --init` (perhaps need to run `npm install jest --global` first?).

Add `"test": "jest --watchAll"` to the `scripts` block of `package.json`

Run tests from the command line by running `npm run test`