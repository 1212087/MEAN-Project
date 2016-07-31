var post = require('../models/Post');
var user = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(app) {

	/* ------ New Post ------ */
	/* [Object] Post */
	app.post('/api/post/NewPost', function(req, res) {
		// console.log(req.body);
		var newPost = new post;
		newPost.userId = req.body.userId;
		newPost.title = req.body.title;
		newPost.phoneNumber = req.body.phone;
		newPost.province = req.body.province;
		newPost.couty = req.body.couty;
		newPost.category = req.body.category;
		newPost.description = req.body.description;
		newPost.price = req.body.price;
		newPost.address = req.body.address;
		newPost.creationDate = Date.now();
		newPost.lastUpdateDate = Date.now();
		newPost.picture = req.body.picture;
		if (req.body.morePictures) {
			newPost.morePictures = req.body.morePictures;
		}

		newPost.save(function(err) {
			if (err) {
				res.status(500);
				res.send("Có lỗi xảy ra!");
			} else {
				res.status(200);
				res.json(newPost);
			}
		});
	});

	/* ------ Get Posts By Province ------ */
	/*	
		{
			id: provinceId
		}
	*/
	app.post('/api/post/getByProvince', function(req, res) {
		post.find({
			'province._id': req.body.id
		}, null, {
			sort: '-lastUpdateDate'
		}, function(err, posts) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra');
			} else if (posts.length === 0) {
				res.status(500);
				res.send('Không tìm thấy bài viết!');
			} else {
				res.status(200);
				res.json(posts);
			}
		});
	});

	/* ------ Get Posts By Category ------ */
	/*	
		{
			id: categoryId
		}
	*/
	app.post('/api/post/getByCategory', function(req, res) {
		// console.log('mã loai: ' + req.body.id);
		post.find({
			'category._id': req.body.id
		}, null, {
			sort: '-lastUpdateDate'
		}, function(err, posts) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (posts.length === 0) {
				res.status(500);
				res.send('Không tìm thấy bài viết');
			} else {
				res.status(200);
				res.json(posts);
			}
		});
	});

	/* ------ Get Posts By Province + Category ------ */
	/*
		{
			currentProvince: {id: provinceId},
			currentCategory: {id: categoryId})
		}
	*/
	app.post('/api/post/getByProvinceAndCategory', function(req, res) {
		// console.log('province: ' + req.body.currentProvince.id + 'category: ' + req.body.currentCategory.id);
		post.find({
			'province._id': req.body.currentProvince.id,
			'category._id': req.body.currentCategory.id
		}, function(err, posts) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (!posts.length) {
				res.status(500);
				res.send('Không tìm thấy bài viết');
			} else {
				res.status(200);
				res.json(posts);
			}
		});
	});

	/* ------ Get All Posts ------ */
	app.get('/api/post/list', function(req, res) {
		post.find({}, null, {
			sort: '-lastUpdateDate'
		}, function(err, posts) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (posts.length === 0) {
				res.status(500);
				res.send('Không tìm thấy bài viết');
			} else {
				res.status(200);
				res.json(posts);
			}
		});
	});

	/* ------ Get Active Post ------ */
	app.get('/api/post/getActive', function(req, res) {
		post.find({status: true},null, {sort: '-lastUpdateDate'}, function(error, posts){
			if(error) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if(posts === null | posts.length === 0) {
				res.status(404);
				res.send('Không tìm thấy bài viết!');
			} else {
				res.status(200);
				res.json(posts);
			}
		});
	});
	/* ------ Get posts By postId ------ */
	/*	{
			id: postId
		}
	*/
	app.post('/api/post/getById', function(req, res) {
		console.log(req.body);
		post.findById(req.body.id, function(err, posts) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (posts === null || posts.length === 0) {
				res.status(500);
				res.send('Không tìm thấy bài viết');
			} else {
				res.status(200);
				res.json(posts);
			}
		});
	});

	/* ------ Get Posts By userId ------ */
	/*
		{
			id: userId
		}
	*/
	app.post('/api/post/getByUser', function(req, res) {
		post.find({
			userId: req.body.id
		}, null, {sort: '-lastUpdateDate'}, function(err, posts) {
			if (err) {
				res.status(500);
				res.send("Có lỗi xảy ra!");
			} else if (posts.length === 0) {
				res.status(404);
				res.send('Không tìm thấy bài viết');
			} else {
				res.status(200);
				res.json(posts);
			}
		});
	});

	/* ------ Update Post ------ */
	/*
		{
			[Object]
		}
	*/
	app.post('/api/post/update', function(req, res) {
		// console.log(req.body);
		post.findById(req.body._id, function(err, doc) {
			if (err) {
				res.status(500);
				res.send('Có lỗi xảy ra!');
			} else if (doc.length === 0) {
				res.status(500);
				res.send('Không tìm thấy bài viết!');
			} else {
				doc.title          = req.body.title;
				doc.price          = req.body.price;
				doc.phoneNumner    = req.body.phoneNumber;
				doc.address        = req.body.address;
				doc.province       = req.body.province;
				doc.couty          = req.body.couty;
				doc.category       = req.body.category;
				doc.picture        = req.body.picture;
				doc.description    = req.body.description;
				doc.lastUpdateDate = Date.now();
				doc.save(function(err) {
					if (err) {
						res.status(500);
						res.send('Có lỗi xảy ra');
					} else {
						res.status(200);
						res.send('Lưu chỉnh sửa thành công!');
					}
				});
			}
		});
	});

	/* ------ Deactive Post ------ */
	app.post('/api/post/deactive', function(req, res){
		user.findById(req.body.userId, function(err, user){
			if(err) {
				res.status(500);
				res.send(err);
			} else if (user === null || user.length === 0) {
				res.status(404);
				res.send('Có lỗi xảy ra!');
			} else {
				if(user.role === 'user') {
					res.status(401);
					res.send('Bạn không có quyền thực hiện hành động này!');
				} else {
					post.findById(req.body._id, function(err, foundPost){
						if (err) {
							res.status(500);
							res.send('Có lỗi xảy ra!');
						} else if (foundPost === null || foundPost.length === 0) {
							res.status(404);
							res.send('Không tìm thấy bài viết!');
						} else {
							foundPost.status = false;
							foundPost.lastUpdateDate = Date.now();
							foundPost.save(function(err){
								if(err) {
									res.status(500);
									res.send('Lỗi khi lưu trạng thái bài viết');
								} else {
									res.status(200);
									res.send('Thay đổi trạng thái bài viết thành công!');
								} 
							});
						}
					});
				}
			}
		});
	});

	/* ------ Active Post ------ */
	app.post('/api/post/active', function(req, res){
		user.findById(req.body.userId, function(err, user){
			if(err) {
				res.status(500);
				res.send(err);
			} else if (user === null || user.length === 0) {
				res.status(404);
				res.send('Có lỗi xảy ra!');
			} else {
				if(user.role === 'user') {
					res.status(401);
					res.send('Bạn không có quyền thực hiện hành động này!');
				} else {
					post.findById(req.body._id, function(err, foundPost){
						if (err) {
							res.status(500);
							res.send('Có lỗi xảy ra!');
						} else if (foundPost === null || foundPost.length === 0) {
							res.status(404);
							res.send('Không tìm thấy bài viết!');
						} else {
							foundPost.status = true;
							foundPost.lastUpdateDate = Date.now();
							foundPost.save(function(err){
								if(err) {
									res.status(500);
									res.send('Lỗi khi lưu trạng thái bài viết');
								} else {
									res.status(200);
									res.send('Thay đổi trạng thái bài viết thành công!');
								} 
							});
						}
					});
				}
			}
		});
	});
};