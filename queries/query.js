// Contains the business logic for the API calls

const client = require('../util/cardano-db');

exports.getQuery = (req, res, next) => {
    res.json({
        query: [{title: 'First', content: 'API Call'}]
    });
};
