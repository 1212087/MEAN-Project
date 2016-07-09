var post = require('../models/Post');

module.exports = function (app) {
	app.post('/api/post/new', function(req, res) {
		var newPost = new post;
		newPost.title = req.body.title;
		newPost.category = req.body.category;
		newPost.description = req.body.description;
		newPost.userId = req.body._id;
		newPost.creationDate = Date.now();
		newPost.lastUpdateDate = Date.now();
		newPost.image = req.body.imageUrl;

		newPost.save(function(err){
			if(err){
				res.status(500);
                res.end(err);
			}
			else{
				res.status(200);
				res.json(newPost);
			}
		})
	})

	app.get('/api/post/findByUserId', function(req, res){
		post.find({userId: req.body._id}, function(err, posts){
			if(err){
				res.status(500);
				res.end(err);
			}
			else{
				res.status(200);
				res.json(posts);
			}
		})
	})

	app.get('/api/post/list', function(req, res){
		post.find(function(err, posts){
			if(err){
				res.status(500);
				res.end(err);
			}
			else{
				res.status(200);
				res.json(posts);
			}
		})
	})
}