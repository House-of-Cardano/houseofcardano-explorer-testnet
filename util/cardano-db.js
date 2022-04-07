const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'cardano',
    port: 5432,
    password: 'ada',
    database: 'testnet'
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    all: (text) => pool.query(text)
  }
  
// VERY IMPORTANT
// If you need to restart the database for any reason, these steps must be done first!!!
// for cardano user to work, after creating the user had to run these commands in the database at the 'testnet=#' prompt

// grant all privileges on all tables in schema public to cardano ;
// grant all privileges on all sequences in schema public to cardano ;
// grant all privileges on all functions in schema public to cardano ;
