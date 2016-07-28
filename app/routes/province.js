var province = require('../models/Province');

module.exports = function(app) {
    app.get('/api/province/list', function(req, res) {
        province.find(function(err, doc) {
            if (err) {
                console.log('Error:' + err);
            } else {
                res.json(doc);
            }
        });
    });

    app.post('/api/province/getById', function(req, res) {
        province.findById(req.body.id, function(err, province) {
            if (err) {
                res.status(500);
                res.send("Lỗi!");
            } else {
                res.status(200);
                res.json(province);
            }
        });
    });
};