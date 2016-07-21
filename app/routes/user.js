var user            = require('../models/User');
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var nodemailer      = require('nodemailer');
var configGmail     = require('../../config/email');
module.exports      = function (app) {

    // xử lý khi nhận request từ angular service
    var sess;
    /* ------ Load tất cả User ------*/
    app.get('/api/user/list', function (req, res) {
        console.log('Get listUser request');
        user.find(function(err, users){
            if(err)
            {
                console.log('Error:' + err);
            }
            else{
                res.json(users);
                console.log('Users sent!');
            }
        })
    });

    /* ------ Load User theo Email ------ */
    app.post('/api/user/getUserByEmail', function(req, res){
        user.findOne({email: req.body.email}, function(err, user){
            if(err){
                res.status(500);
                res.end(err);
                console.log('err: ' +err)
            }
            else{
                res.status(200);
                res.json(user);
            }
        })
    })

    /* ------ Load user theo ID ------ */
    app.post('/api/user/getByID', function(req, res){
        user.findById(req.body.id, function(err, user){
            
            if(err){
                res.status(404);
                res.send("Không tìm thấy user");
            }
            else{
                res.status(200);
                res.json(user);
            }
        })
    })
    /* ------ Đăng ký mới user ------*/
    app.post('/api/user/register', passport.authenticate('register'), function (req, res) {
        console.log('Get register request: ' + req.body.email);
        return res.send(req.user);
    });

    /* ------ Đăng nhập ------*/
    app.post('/api/user/login', passport.authenticate('login'), function(req, res){
        console.log('Get login request: ' + req.user.email);
        sess = req.session;
        sess.user = req.user;
        console.log(sess)
        return res.json(sess);
    })

    /* ------ Quên mật khẩu ------*/
    app.post('/api/user/forget', function(req, res){
        console.log('Get forget request: ' +req.body.email);
        var inputEmail = req.body.email;
        user.findOne({email: inputEmail}, function(err, foundUser){
            // nếu có lỗi thì trả về lỗi.
            if (err) {
                throw err;
            }
            // nếu không tìm thấy user
            else if(!foundUser)
            {
                console.log('No user found!');
                res.status(500).send({error: 'Email này chưa đăng ký'});
            }
            // nếu có user
            else {
                console.log('1 user found!');
                // tạo mật khẩu ngẫu nhiên 10 chữ số
                var ranString = Math.random().toString(36).substr(2, 10);

                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport({
                    service: configGmail.gmail.service,
                    auth :{
                        user: configGmail.gmail.user,
                        pass: configGmail.gmail.pass
                    }
                });

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: 'iMarket Admin Team ' + configGmail.gmail.user, // sender address
                    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
                    subject: 'Email khôi phục mật khẩu', // Subject line
                    text:   'Chào bạn, chúng tôi nhận được yêu cầu từ bạn (hoặc ai đó) đã quên mật khẩu tài khoản iMarket liên kết với địa chị email này.\n\n' +
                            'Đây là mật khẩu mới của bạn: ' + ranString + '\n\n' + 
                            'Đừng quên cập nhật lại mật khẩu của bạn sau khi đăng nhập!' // plaintext body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        throw err;
                    }
                    else {
                        console.log('Message sent: ' + info.response);
                        foundUser.password = foundUser.generateHash(ranString);
                        foundUser.save(function(err){
                            if(err){
                                throw err;
                            }
                            else{
                                req.flash('success', 'Chúng tôi đã gửi password tới email của bạn, vui lòng kiểm tra email!');
                                return res.redirect('/login');
                            }
                        })
                    }
                    
                });
            }
        })
    });

    // Đăng xuất
    app.get('/api/user/logout', function(req, res){
        req.session.destroy(function(err){
            if(!err){
                res.status(200);
                res.end('Bạn đã đăng xuất thành công!');
            }
            else{
                res.status(500);
                res.end(err);
                sess = null;
            }
        });
    })
};

    
