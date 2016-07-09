var province    = require('./province');
var user        = require('./user');
var post 		= require('./post');
var mongoose    = require('mongoose');


module.exports = function (app) {
    // Quản lý province
    province(app);
    // Quản lý user
    user(app);
    // Quản lý post
    post(app);
    
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