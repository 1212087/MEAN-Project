var report = require('../models/Report');
var user = require('../models/User');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {
	app.post('/api/report/submit', function(req, res) {
		report.findOne({ // kiểm tra user có report bài này chưa
			postId: req.body.PostId,
			userId: req.body.UserId
		}, function(error, foundReport) {
			if (error) {
				res.status(500).send('Có lỗi xảy ra!');
			} else { // chưa có report
				if (foundReport === null || foundReport.length === 0) {
					var newReport = new report();
					newReport.userId = req.body.UserId;
					newReport.postId = req.body.PostId;
					newReport.reason = req.body.reason;
					newReport.createdDate = Date.now();
					newReport.save(function(error) {
						if (error) {
							res.status(500).send('Có lỗi xảy ra!');
						} else {
							res.status(200).send('Lưu báo cáo thành công, đang chờ xử lý!');
						}
					});
				} else { // report rồi
					res.status(401).send('Bạn đã report bài viết này rồi!');
				}
			}
		});
	});

	app.get('/api/report/get', function(req, res) {
		report.find({
			resloved: false
		}, null, {
			sort: '-createdDate'
		}).populate('postId userId').exec(function(error, foundReports) {
			if (error) {
				res.status(500).send('Có lỗi xảy ra!');
			} else if (foundReports === null | foundReports.length === 0) {
				res.status(404).send('Không tìm thấy report nào!');
			} else {
				res.status(200).json(foundReports);
			}
		});
	});

	app.post('/api/report/getById', function(req, res) {
		report.findById(req.body._id).populate('postId userId').exec(function(error, foundReport) {
			if (error) {
				res.status(500).send('Có lỗi xảy ra!');
			} else {
				res.status(200).json(foundReport);
			}
		});
	});

	app.post('/api/report/getByPost', function(req, res) {
		report.find({
			postId: req.body._id,
			resloved: false
		}, null, {
			sort: '-createdDate'
		}).populate('userId').exec(function(error, foundReports) {
			if (error) {
				res.status(500).send('Có lỗi xảy ra!');
			} else if (foundReports === null || foundReports.length === 0) {
				res.status(404).send("Không tìm thấy báo cáo nào!");
			} else {
				res.status(200).json(foundReports);
			}
		});
	});

	app.post('/api/report/getByUser', function(req, res) {
		report.find({
			userId: req.body._id,
			resloved: false
		}, null, {
			sort: '-createdDate'
		}).populate('postId').exec(function(error, foundReports) {
			if (error) {
				res.status(500).send('Có lỗi xảy ra!');
			} else if (foundReports === null || foundReports.length === 0) {
				res.status(404).send("Không tìm thấy báo cáo nào!");
			} else {
				res.status(200).json(foundReports);
			}
		});
	});

	app.post('/api/report/deactive', function(req, res) {
		user.findById(req.body.userId, function(error, foundUser) {
			if (error) {
				res.status(500).send('Có lỗi xảy ra!');
			} else if (foundUser === null || foundUser.length === 0) {
				res.status(500).send('Có lỗi xảy ra!');
			} else {
				if (foundUser.isAdmin === false) {
					res.status(401).send('Bạn không có quyền thực hiện hành vi này!');
				} else {
					report.update({
						postId: req.body._id
					}, {
						resloved: true,
						reslovedDate: Date.now()
					}, {
						multi: true
					}, function(error, num) {
						if (error) {
							res.status(500).send('Có lỗi khi lưu kết quả report!');
						} else {
							res.status(200).send('Lưu trạng thái báo cáo thành công!');
						}
					});
				}
			}
		});
	});

	app.get('/api/report/countUnreslove', function(req, res) {
		report.find({
			resloved: false
		}).count(function(error, numReports) {
			if (error) {
				res.status(500).send('Có lỗi xảy ra!');
			} else {
				res.status(200).json(numReports);
			}
		});
	});
};