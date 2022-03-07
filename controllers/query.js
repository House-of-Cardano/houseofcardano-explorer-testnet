// Contains the business logic for the API calls

exports.getQuery = (req, res, next) => {
    res.json({
        query: [{title: 'First', content: 'API Call'}]
    });
};