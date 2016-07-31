var report = require('../models/Report');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {
	app.post('/api/report/submit', function(req, res) {
		console.log(req.body);
		report.find({
			userId: req.body.UserId,
			postId: req.body.PostId
		}, function(err, foundReport) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else {
				if (foundReport.length === 0) {
					var newReport    = new report;
					newReport.userId = req.body.UserId;
					newReport.postId = req.body.PostId;
					newReport.reason = req.body.reason;
					newReport.save(function(err) {
						if (err) {
							console.log(err);
							res.status(500);
							res.send('Có lỗi xảy ra!');
						} else {
							res.status(200);
							res.send('Lưu báo cáo thành công, đang chờ xử lý!');
						}
					});
				} else {
					res.status(401);
					res.send('Bạn đã report bài viết này rồi');
				}
			}
		});
	});
};