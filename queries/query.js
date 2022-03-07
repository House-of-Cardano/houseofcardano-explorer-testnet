// Contains the business logic for the API calls

const client = require('../util/cardano-db');

exports.getQuery = (req, res, next) => {
    res.json({
        query: [{title: 'First', content: 'API Call'}]
    });
};

client.connect();
exports.getCardano = (req, res, next) => {
    client.query('select * from meta', (err, result) => {
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
};