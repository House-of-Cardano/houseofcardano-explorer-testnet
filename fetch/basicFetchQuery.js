const fetch = require("node-fetch");

async function query(url) {
  const res = await fetch(url);
  return res.json();
}

module.exports = query;