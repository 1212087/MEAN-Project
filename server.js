var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),
	Strategy;
var mongo = require('mongodb');

// database
var mongoose = require('mongoose');
var db = require('./config/database');

// Passport init
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// View engine 
app.set('views', path.join(__dirname, 'views'));

// load route
var routes = require('./app/routes');

app.use(bodyParser.json());
app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}));
app.use(bodyParser.urlencoded({
	extended: true
}));

//Cấu hình ứng dụng sẽ chạy ở thư mục public
app.use(express.static(__dirname + '/public'));

//Express Session 
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

//Express Validator 
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while (namespace.length) {
			formParam + '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Kết nối Flash
app.use(flash());

//Global Variables 
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//Kết nối cơ sở dữ liệu
mongoose.Promise = global.Promise;
mongoose.connect(db.url);

//Khởi động route
routes(app);

//Chạy server
server.listen(port, function() {
	console.log('Server is running on ' + port);
});

exports = module.exports = app;