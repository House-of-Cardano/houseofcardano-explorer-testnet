const fs = require("fs");
const path = require("path");
const request = require("supertest");

// const getInformation = require('./routes/query');

const app = require("../server");

describe("cardnao-explorer-build-submit-tx", () => {
  it("returns status code 200 if endpoint successfully exposed", async () => {
    const res = await request(app).get(
      "/query/cardano-explorer-build-submit-tx"
    );
    expect(res.statusCode).toEqual(200);
  });
});

describe("cardnao-explorer-meta", () => {
  it("returns status code 200 if endpoint successfully exposed", async () => {
    const res = await request(app).get("/query/cardano-explorer-meta");
    expect(res.statusCode).toEqual(200);
  });
});

describe("cardnao-explorer-queryBank", () => {
  it("returns status code 200 if endpoint successfully exposed", async () => {
    const res = await request(app).get(
      "/query/cardano-explorer-queryBank?addr=addr_test1vzc7magws73cel8lshw4yncmejylq4lutw2xx9ef02l70xs5jjjv5"
    );
    expect(res.statusCode).toEqual(200);
  });
});
