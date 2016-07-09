var LocalStrategy = require('passport-local').Strategy;

// load model User
var User = require('../app/models/User');

module.exports = function(passport) {

// sử dụng tạo session
passport.serializeUser(function(user, done) {
    return done(null, user.id);
});

// sử dụng để hủy session
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        return done(err, user);
    });
});

// =========================================================================
// ĐĂNG NHẬP HỆ THỐNG ======================================================
// =========================================================================
passport.use('login', new LocalStrategy({
    // mặc định passport sử dụng username để đăng nhập. Ở đây dùng email để thay thế
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // cho phép sử dụng route gọi đến để kiểm tra đăng nhập hay chưa
}, function(req, email, password, done) {

    // bất đồng bộ
    process.nextTick(function() {
        User.findOne({
            'email': email
        }, function(err, user) {
            // nếu có lỗi thì trả về lỗi.
            if (err) {
                return done(err);
            }

            if (!user || !user.validPassword(password)) {
                console.log('không tìm thấy user '+ email + ' hoặc sai pass: ' +password);
                return done(null, false);
            }
            // thực hiện thành công thì trả về thông tin user
            else {
                console.log(user);
                user.lastAccessDate = Date.now();
                user.save(function(err){
                    if(err){
                        console.log(err);
                        return done(null, false);
                    }
                    else{
                        console.log('Success');
                        return done(null, user);
                    }
                }) 
            }
        });
    });
}));

// =========================================================================
// ĐĂNG KÝ THÀNH VIÊN ======================================================
// =========================================================================

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {

    process.nextTick(function() {

        // kiểm tra xem email đã được sử dụng hay chưa
        User.findOne({
            'email': email
        }, function(err, existingUser) {

            if (err) {
                return done(err);
            }

            // nếu tồn tại user với email này
            if (existingUser) {
                return done(null, false);
            }
            //  Ngược lại thì tạo mới user
            else {

                var newUser = new User();
                newUser.name= req.body.name;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.role = 'user';

                newUser.save(function(err) {
                    if (err) {
                        console.log(err);
                        return done(null, false);
                    }
                    console.log('Success');
                    return done(null, newUser);
                });
            }
        });
    });
}));
};