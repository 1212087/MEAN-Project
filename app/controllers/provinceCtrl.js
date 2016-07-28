// var province = require('../models/Province');

// module.exports.find = function (req, res) {
//     province.find({}, function (err, doc) {
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.json(doc);
//         }
//     })
// }

var restful = require('node-restful');
module.exports = function(app, route) {
    // Setup the Controller for REST
    var rest = restful.model(
        'Province',
        app.models.Province
    ).methods(['get', 'push', 'post', 'delete']);
    //Đăng ký với app
    rest.register(app, route);
    //Trả về middleware
    return function(req, res, next) {
        next();
    };
};