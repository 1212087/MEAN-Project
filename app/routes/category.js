var category = require('../models/Category');

module.exports = function (app) {
    app.get('/api/category/list', function (req, res) {
        category.find(function(err, doc){
            if(err)
            {
                res.status(500);
                res.send(err);
            }
            else{
                res.status(200);
                res.json(doc);
            }
        });
    });
};