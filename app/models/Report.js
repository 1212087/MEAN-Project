var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed    = mongoose.Schema.Types.Mixed;

var Schema = mongoose.Schema({
	postId: {
		type: ObjectId,
		required: true,
		ref: 'Post'
	},
	userId: {
		type: ObjectId,
		required: true,
		ref: 'User'
	},
	reason: {
		type: String,
		required: true
	},
	resloved: {
		type: Boolean,
		default: false
	},
	createdDate: {
		type: Date,
		required: true,
		default: Date.now
	},
	reslovedDate: {
		type: Date,
		required: false
	}
});

module.exports = mongoose.model('Report', Schema);