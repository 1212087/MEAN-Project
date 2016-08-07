var category = require('../models/Category');

module.exports = function(app) {
    app.get('/api/category/list', function(req, res) {
        category.find(function(error, foundCategories) {
            if (error) {
                res.status(500);
                res.send("Có lỗi khi lấy danh sách category");
            } else if (foundCategories === null || foundCategories.length === 0) {
                res.status(404).send('Không tim thấy danh sách category!');
            } else {
                res.status(200);
                res.json(foundCategories);
            }
        });
    });
};