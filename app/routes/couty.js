var couty = require('../models/Couty');

module.exports = function(app) {
    app.get('/api/couty/list', function(req, res) {
        couty.find(function(error, foundCouties) {
            if (error) {
                res.status(500);
                res.send(err);
            } else if (foundCouties === null || foundCouties.length === 0) {
                res.status(404).send('Không tìm thấy danh sách quận/huyện!');
            } else {
                res.status(200);
                res.json(doc);
            }
        });
    });

    app.post('/api/couty/getByProvince', function(req, res) {
        couty.find({
            provinceId: req.body._id
        }, function(error, couties) {
            if (error) {
                res.status(500);
                res.send('Có lỗi xảy ra!');
            } else {
                res.status(200);
                res.json(couties);
            }
        });
    });

    app.post('/api/couty/getById', function(req, res) {
        couty.findById(req.body.id, function(err, couty) {
            if (err) {
                res.status(500);
            } else {
                res.status(200);
                res.json(couty);
            }
        });
    });
};