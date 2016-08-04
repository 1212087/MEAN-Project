var report = require('../models/Report');
var user = require('../models/User');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {
	app.post('/api/report/submit', function(req, res) {
		report.findOne({ // kiểm tra user có report bài này chưa
			post: req.body.PostId,
			user: req.body.UserId
		}, function(err, foundReport) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else { // chưa có report
				if (foundReport === null || foundReport.length === 0) {
					var newReport = new report();
					newReport.user = req.body.UserId;
					newReport.post = req.body.PostId;
					newReport.reason = req.body.reason;
					newReport.createdDate = Date.now();
					newReport.save(function(err) {
						if (err) {
							res.status(500);
							res.send('Có lỗi xảy ra!');
						} else {
							res.status(200);
							res.send('Lưu báo cáo thành công, đang chờ xử lý!');
						}
					});
				} else { // report rồi
					res.status(401);
					res.send('Bạn đã report bài viết này rồi!');
				}
			}
		});
	});

	app.get('/api/report/get', function(req, res) {

		report.find({
			resloved: false
		}, null, {
			sort: '-createdDate'
		}).populate('post user').exec(function(error, reports) {
			if (error) {
				res.status(500);
				res.send('Error');
			} else if (reports === null | reports.length === 0) {
				res.status(404);
				res.send('Không tìm thấy report nào!');
			} else {
				res.status(200);
				res.json(reports);
			}
		});
	});

	app.post('/api/report/getById', function(req, res) {
		report.findById(req.body._id).populate('post user').exec(function(error, foundReport) {
			if (error) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else {
				res.status(200);
				res.json(foundReport);
			}
		});
	});

	app.post('/api/report/getByPost', function(req, res) {
		report.find({
			post: req.body._id,
			resloved: false
		}, null, {
			sort: '-createdDate'
		}).populate('user').exec(function(error, foundReports) {
			if (error) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (foundReports === null || foundReports.length === 0) {
				res.status(404);
				res.send("Không tìm thấy báo cáo nào!");
			} else {
				res.status(200);
				res.json(foundReports);
			}
		});
	});

	app.post('/api/report/getByUser', function(req, res) {
		report.find({
			user: req.body._id,
			resloved: false
		}, null, {
			sort: '-createdDate'
		}).populate('post').exec(function(error, foundReports) {
			if (error) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (foundReports === null || foundReports.length === 0) {
				res.status(404);
				res.send("Không tìm thấy báo cáo nào!");
			} else {
				res.status(200);
				res.json(foundReports);
			}
		});
	});

	app.post('/api/report/deactive', function(req, res) {
		user.findById(req.body.userId, function(error, foundUser) {
			if (error) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (foundUser === null || foundUser.length === 0) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else {
				if (foundUser.isAdmin === false) {
					res.status(401);
					res.send('Bạn không có quyền thực hiện hành vi này!');
				} else {
					report.update({
						post: req.body._id
					}, {
						resloved: true,
						reslovedDate: Date.now()
					}, {
						multi: true
					}, function(error, num) {
						if (error) {
							res.status(500);
							res.send('Có lỗi khi lưu kết quả report!');
						} else {
							res.status(200);
							res.send('Lưu trạng thái báo cáo thành công!');
						}
					});
				}
			}
		});
	});

	app.get('/api/report/countUnreslove', function(req, res){
		report.find({resloved:false}).count(function(error, numReports){
			if(error) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else {
				res.status(200);
				res.json(numReports);
			}
		});
	});
};