var post 		= require('../models/Post');
var ObjectId	= require('mongoose').Types.ObjectId;

module.exports = function (app) {
	app.post('/api/post/NewPost', function(req, res) {
		// console.log(req.body);
		var newPost = new post;
		newPost.userId = req.body.userId;
		newPost.title = req.body.title;
		newPost.phoneNumber = req.body.phone;
		newPost.province = req.body.province;
		newPost.category = req.body.category;
		newPost.description = req.body.description;
		newPost.price = req.body.price;
		newPost.address = req.body.address;
		newPost.creationDate = Date.now();
		newPost.lastUpdateDate = Date.now();
		newPost.picture = req.body.picture;
		if(req.body.morePictures){
			newPost.morePictures = req.body.morePictures;
		}

		newPost.save(function(err){
			if(err){
				console.log('Error while saving new post:  ' + err);
				res.status(500);
                res.json(err);
			}
			else{
				res.status(200);
				res.json(newPost);
			}
		})
	})


	app.get('/api/post/getByUserId', function(req, res){
		post.find({userId: req.body._id}, null, {sort:'-lastUpdateDate'}, function(err, posts){
			if(err){
				console.log('Error while getting post by User ID: ' + err);
				res.status(500);
				res.end(err);
			}
			else{
				res.status(200);
				res.json(posts);
			}
		})
	})

	app.post('/api/post/getByProvince', function(req, res){
		post.find({'province._id':req.body.id}, null, {sort:'-lastUpdateDate'}, function(err, posts){
			if(err){
				console.log('Error while getting post by Province: '+ err);
				res.status(500);
				res.send('Không tìm thấy bài viết');
			}
			else{
				// console.log(posts);
				res.status(200);
				res.json(posts);
			}
		})
	})

	app.post('/api/post/getByCategory', function(req, res){
		console.log('mã loai: '+req.body.id);
		post.find({'category._id':req.body.id}, null,  {sort:'-lastUpdateDate'}, function(err, posts){
			if(err){
				console.log('Error while getting post by Category: '+ err);
				res.status(500);
				res.send('Không tìm thấy bài viết');
			}
			else{
				res.status(200);
				res.json(posts);
			}
		})
	})

	app.post('/api/post/getByProvinceAndCategory', function(req, res){
		console.log('province: '+ req.body.currentProvince.id + 'category: '+req.body.currentCategory.id);
		post.find({'province._id': req.body.currentProvince.id, 'category._id':req.body.currentCategory.id}, function(err, posts){
			if(err){
				console.log('Error while getting posts by Province ' + req.body.currentProvince.id + ' and Category ' + req.body.currentCategory.id);
				res.status(500);
				res.send('Không tìm thấy bài viết');
			}
			else{
				res.status(200);
				res.json(posts);
			}
		})
	})

	app.get('/api/post/list', function(req, res){
		post.find({}, null, {sort:'-lastUpdateDate'}, function(err, posts){
			if(err){
				console.log('Error while getting all post: '+err);
				res.status(500);
				res.end(err);
			}
			else{
				res.status(200);
				res.json(posts);
			}
		})
	})

	app.post('/api/post/getById', function(req, res){
		post.findById(req.body.id, function(err, post){
			
			if(err){
				res.status(404);
				res.send("Không tìm thấy bài viết");
			}
			else{
				res.status(200);
				res.json(post);
			}
		})
	})
}