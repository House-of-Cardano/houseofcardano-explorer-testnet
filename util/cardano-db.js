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
  }
  
// for cardano user to work, after creating teh user had to run these commands in the database at the 'testnet=#' prompt

// grant all privileges on all tables in schema public to cardano ;
// grant all privileges on all sequences in schema public to cardano ;
// grant all privileges on all functions in schema public to cardano ;
