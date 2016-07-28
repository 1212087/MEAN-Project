var province    = require('./province');
var user        = require('./user');
var post 		= require('./post');
var category    = require('./category');
var report      = require('./report');
var couty       = require('./couty');
var mongoose    = require('mongoose');


module.exports = function (app) {
    // Quản lý province
    province(app);
    // Quản lý couty
    couty(app);
    // Quản lý user
    user(app);
    // Quản lý post
    post(app);
    // Quản lý category
    category(app);
    // Quản lý report
    report(app);
    app.get('*', function (req, res){
        res.sendfile('public/index.html');
    });
};

function isLoggedIn (req, res, next){
	// nếu user đã xác thực đăng nhập bằng session
	if (req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/login');
	}
}