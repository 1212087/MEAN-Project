var message = require('../models/Message');
var user = require('../models/User');

module.exports = function(app) {
    app.post('/api/message/new', function(req, res) {
        user.findById(req.body.toUser, function(error, foundUser) {
            if (error || foundUser === null || foundUser.length === 0) {
                res.status(500).send('Có lỗi xảy ra hoặc không tìm thấy người nhận!');
            } else {
                var newMessage = new message();
                newMessage.fromUser = req.body.fromUser;
                newMessage.toUser = req.body.toUser;
                newMessage.message = req.body.message;
                newMessage.createdDate = Date.now();
                newMessage.save(function(error) {
                    if (error) {
                        res.status(500).send('Lỗi khi lưu tin nhắn!');
                    } else {
                        res.status(200).send('Gửi tin nhắn thành công!');
                    }
                });
            }
        });
    });

    app.post('/api/message/sent-messages', function(req, res) {
        message.find({
            fromUser: req.body._id
        }, null, {sort: '-createdDate'}).populate('toUser', 'name email').exec(function(error, foundMessages) {
            if (error || foundMessages === null || foundMessages.length === 0) {
                res.status(500).send("Có lỗi xảy ra hoặc không tìm thấy tin nhắn!");
            } else {
                res.status(200).json(foundMessages);
            }
        });
    });

    app.post('/api/message/recieved-messages', function(req, res) {
        message.find({
            toUser: req.body._id
        }, null, {sort:'-createdDate'}).populate('fromUser', 'name email').exec(function(error, foundMessages) {
            if (error || foundMessages === null || foundMessages.length === 0) {
                res.status(500).send('Có lỗi xảy ra hoặc không tìm thấy tin nhắn!');
            } else {
                message.update({
                    toUser: req.body._id,
                    seen: false
                }, {
                    seen: true,
                    seenDate: Date.now()
                }, {
                    multi: true
                }, function(error) {
                    if (error) {
                        res.status(500).send('Không thể cập nhật trạng thái tin nhắn');
                    } else {
                        res.status(200).json(foundMessages);
                    }
                });
            }
        });
    });

    app.post('/api/message/countUnread', function(req, res){
        message.find({
            toUser: req.body._id,
            seen: false
        }).count(function(error, numMessages){
            if(error) {
                res.status(500).send('Có lỗi xảy ra!');
            } else {
                res.status(200).json(numMessages);
            }
        });
    });
};