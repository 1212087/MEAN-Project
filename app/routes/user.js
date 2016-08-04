var user = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var configGmail = require('../../config/email');
module.exports = function(app) {

    // xử lý khi nhận request từ angular service
    var sess;
    /* ------ Load tất cả User ------*/
    app.post('/api/user/getAll', function(req, res) {
        user.findById(req.body._id, function(error, foundUser) {
            if (error || foundUser === null || foundUser.length === 0) {
                res.status(500);
                res.send('Có lỗi xảy ra!');
            } else {
                if (foundUser.isAdmin === false) {
                    res.status(401);
                    res.send('Bạn không có quyền thực hiện điều này');
                } else {
                    user.find({}, null, {
                        sort: '-creationDate'
                    }, function(error, foundUsers) {
                        if (error) {
                            res.status(500);
                            res.send('Có lỗi xảy ra!');
                        } else if (foundUser === null || foundUser.length === 0) {
                            res.status(404);
                            res.send('Không tìm thấy User nào!');
                        } else {
                            res.status(200);
                            res.json(foundUsers);
                        }
                    });
                }
            }
        });

    });

    /* ------ Load User theo Email ------ */
    app.post('/api/user/getUserByEmail', function(req, res) {
        user.findOne({
            email: req.body.email
        }, function(error, foundUser) {
            if (error) {
                res.status(500);
                res.send('Có lỗi xảy ra');
            } else if (foundUser === null || foundUser.length === 0) {
                res.status(404);
                res.send('Không tìm thấy User');
            } else {
                res.status(200);
                res.json(foundUser);
            }
        });
    });

    /* ------ Load user theo ID ------ */
    app.post('/api/user/getByID', function(req, res) {
        user.findById(req.body.id, function(error, foundUser) {
            if (error) {
                res.status(500);
                res.send('Có lỗi xảy ra');
            } else if (foundUser === null || foundUser.length === 0) {
                res.status(404);
                res.send('Không tìm thấy User');
            } else {
                res.status(200);
                res.json(foundUser);
            }
        });
    });
    /* ------ Đăng ký mới user ------*/
    app.post('/api/user/register', passport.authenticate('register'), function(req, res) {
        // console.log('Get register request: ' + req.body.email);
        return res.send(req.user);
    });

    /* ------ Đăng nhập ------*/
    app.post('/api/user/login', passport.authenticate('login'), function(req, res) {
        // console.log('Get login request: ' + req.user.email);
        sess = req.session;
        sess.user = req.user;
        // console.log(sess);
        return res.json(sess);
    });

    /* ------ Quên mật khẩu ------*/
    app.post('/api/user/forget', function(req, res) {
        var inputEmail = req.body.email;
        user.findOne({
            email: inputEmail
        }, function(error, foundUser) {
            // nếu có lỗi thì trả về lỗi.
            if (error) {
                res.status(500);
                res.send('Có lỗi xảy ra!');
            }
            // nếu không tìm thấy user
            else if (foundUser === null || foundUser.length === 0) {
                res.status(500).send('Email này chưa đăng ký');
            }
            // nếu có user
            else {
                // tạo mật khẩu ngẫu nhiên 10 chữ số
                var ranString = Math.random().toString(36).substr(2, 10);

                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport({
                    service: configGmail.gmail.service,
                    auth: {
                        user: configGmail.gmail.user,
                        pass: configGmail.gmail.pass
                    }
                });

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: 'iMarket Admin Team ' + configGmail.gmail.user, // sender address
                    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
                    subject: 'Email khôi phục mật khẩu', // Subject line
                    text: 'Chào bạn, chúng tôi nhận được yêu cầu từ bạn (hoặc ai đó) đã quên mật khẩu tài khoản iMarket liên kết với địa chị email này.\n\n' +
                        'Đây là mật khẩu mới của bạn: ' + ranString + '\n\n' +
                        'Đừng quên cập nhật lại mật khẩu của bạn sau khi đăng nhập!' // plaintext body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        throw err;
                    } else {
                        // console.log('Message sent: ' + info.response);
                        foundUser.password = foundUser.generateHash(ranString);
                        foundUser.save(function(error) {
                            if (error) {
                                res.status(500);
                                res.send('Có lỗi khi gửi email mật khẩu!');
                            } else {
                                res.status(200).send('Đổi mật khẩu thành công, vui lòng kiểm tra Email đăng ký!');
                            }
                        });
                    }

                });
            }
        });
    });

    // Đăng xuất
    app.get('/api/user/logout', function(req, res) {
        req.session.destroy(function(err) {
            if (!err) {
                res.status(200);
                res.end('Bạn đã đăng xuất thành công!');
            } else {
                res.status(500);
                res.end(err);
                sess = null;
            }
        });
    });

    // Đổi mật khẩu
    app.post('/api/user/changePassword', function(req, res) {
        user.findOne({
            _id: req.body.currentUser
        }, function(error, foundUser) {
            if (error) {
                res.status(500);
                res.send('Có lỗi xảy ra!');
            } else {
                if (foundUser === null || foundUser.length !== 0) {
                    if (!foundUser.validPassword(req.body.current)) {
                        res.status(500);
                        res.send("Mật khẩu không chính xác, xin nhập lại!");
                    } else {
                        foundUser.password = foundUser.generateHash(req.body.new);
                        foundUser.save(function(err) {
                            if (error) {
                                res.status(500);
                                res.send('Có lỗi xảy ra khi lưu mật khẩu!');
                            } else {
                                res.status(200);
                                res.send('Lưu mật khẩu thành công!');
                            }
                        });
                    }
                } else {
                    res.status(500);
                    res.send('Không tìm thấy user');
                }
            }
        });
    });

    //Update 
    app.post('/api/user/update', function(req, res) {
        user.findById(req.body._id, function(err, doc) {
            if (err) {
                res.status(500);
                res.send("Có lỗi xảy ra");
            } else {
                doc.name = req.body.name;
                doc.email = req.body.email;
                doc.phone = req.body.phone;
                doc.address = req.body.address;
                doc.provinceId = req.body.provinceId;
                doc.coutyId = req.body.coutyId;
                doc.save(function(error) {
                    if (error) {
                        // console.log(error);
                        res.status(500);
                        res.send("Lỗi khi lưu thông tin");
                    } else {
                        res.status(200);
                        res.send("Lưu thông tin thành công!");
                    }
                });
            }
        });
    });

    //Check user if isAdmin
    app.post('/api/user/isAdmin', function(req, res) {
        user.findById(req.body._id, function(err, foundUser) {
            if (err) {
                res.status(500);
                res.send('Có lỗi xảy ra!');
            } else if (foundUser.length === 0) {
                res.status(404);
                res.send('Không tìm thấy tài khoản!');
            } else {
                // console.log(foundUser.isAdmin);
                if (foundUser.isAdmin === true) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            }
        });
    });

    // Deactive user
    app.post('/api/user/deactive', function(req, res) {
        user.findById(req.body.userId, function(error, foundUser) {
            if (error || foundUser === null || foundUser.length === 0) {
                res.status(500).send('Có lỗi xảy ra!');
            } else {
                if (!foundUser.isAdmin) {
                    res.status(401).send('Bạn không có quyền thực hiện hành vi này!');
                } else {
                    user.findById(req.body._id, function(error, foundUser2){
                        if(error || foundUser2 === null || foundUser2.length === 0) {
                            res.status(500).send('Có lỗi xảy ra');
                        } else {
                            foundUser2.status = false;
                            foundUser2.save(function(error){
                                if(error) {
                                    res.status(500).send('Có lỗi xảy ra khi lưu trạng thái User');
                                } else {
                                    res.status(200).send('Lưu trạng thái User thành công!');
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    // Active user
    app.post('/api/user/active', function(req, res) {
        user.findById(req.body.userId, function(error, foundUser) {
            if (error || foundUser === null || foundUser.length === 0) {
                res.status(500).send('Có lỗi xảy ra!');
            } else {
                if (!foundUser.isAdmin) {
                    res.status(401).send('Bạn không có quyền thực hiện hành vi này!');
                } else {
                    user.findById(req.body._id, function(error, foundUser2){
                        if(error || foundUser2 === null || foundUser2.length === 0) {
                            res.status(500).send('Có lỗi xảy ra');
                        } else {
                            foundUser2.status = true;
                            foundUser2.save(function(error){
                                if(error) {
                                    res.status(500).send('Có lỗi xảy ra khi lưu trạng thái User');
                                } else {
                                    res.status(200).send('Lưu trạng thái User thành công!');
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    // Set user from  User -> Admin
    app.post('/api/user/setAdmin', function(req, res) {
        user.findById(req.body.userId, function(error, foundUser) {
            if (error || foundUser === null || foundUser.length === 0) {
                res.status(500).send('Có lỗi xảy ra!');
            } else {
                if (!foundUser.isAdmin) {
                    res.status(401).send('Bạn không có quyền thực hiện hành vi này!');
                } else {
                    user.findById(req.body._id, function(error, foundUser2){
                        if(error || foundUser2 === null || foundUser2.length === 0) {
                            res.status(500).send('Có lỗi xảy ra');
                        } else {
                            foundUser2.isAdmin = true;
                            foundUser2.save(function(error){
                                if(error) {
                                    res.status(500).send('Có lỗi xảy ra khi lưu trạng thái User');
                                } else {
                                    res.status(200).send('Lưu trạng thái User thành công!');
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    // Set user from Admin -> User
    app.post('/api/user/setUser', function(req, res) {
        user.findById(req.body.userId, function(error, foundUser) {
            if (error || foundUser === null || foundUser.length === 0) {
                res.status(500).send('Có lỗi xảy ra!');
            } else {
                if (!foundUser.isAdmin) {
                    res.status(401).send('Bạn không có quyền thực hiện hành vi này!');
                } else {
                    user.findById(req.body._id, function(error, foundUser2){
                        if(error || foundUser2 === null || foundUser2.length === 0) {
                            res.status(500).send('Có lỗi xảy ra');
                        } else {
                            foundUser2.isAdmin = false;
                            foundUser2.save(function(error){
                                if(error) {
                                    res.status(500).send('Có lỗi xảy ra khi lưu trạng thái User');
                                } else {
                                    res.status(200).send('Lưu trạng thái User thành công!');
                                }
                            });
                        }
                    });
                }
            }
        });
    });
};