var province = require('../models/Province');

module.exports = function(app) {
    app.get('/api/province/list', function(req, res) {
        province.find(function(error, foundProvinces) {
            if (error) {
                // console.log('Error:' + err);
                res.status(500).send('Có lỗi xảy ra!');
            } else if (foundProvinces === null || foundProvinces.length === 0) {
                res.status(404).send('Không tìm thấy danh sách tỉnh thành!');
            } else {
                res.status(200).json(foundProvinces);
            }
        });
    });

    app.post('/api/province/getById', function(req, res) {
        province.findById(req.body._id, function(error, foundProvince) {
            if (error) {
                res.status(500);
                res.send("Lỗi!");
            } else if (foundProvince === null || foundProvince.length === 0) {
                res.status(404).send('Không tìm thấy tỉnh thành!');
            } else {
                res.status(200);
                res.json(province);
            }
        });
    });
};