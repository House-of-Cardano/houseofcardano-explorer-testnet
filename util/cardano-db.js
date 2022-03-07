const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'cardano',
    port: 5432,
    password: 'ada',
    database: 'testnet'
});

module.exports = client