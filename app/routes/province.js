var province = require('../models/Province');

module.exports = function (app) {
    app.get('/api/province/list', function (req, res) {
        console.log('Get loadProvince request');
        province.find(function(err, doc){
            if(err)
            {
                console.log('Error:' + err);
            }
            else{
                res.json(doc);
                console.log('Provices sent!');
            }
        })
    });
};