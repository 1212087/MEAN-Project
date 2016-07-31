var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = mongoose.Schema({
	userId: {
		type: ObjectId,
		required: true
	},
	postId: {
		type: ObjectId,
		required: true
	},
	reason: {
		type: String,
		required: true
	},
	resloved: {
		type: Boolean,
		default: false
	},
	createDate: {
		type: Date,
		default: Date.now,
	}, 
	reslovedDate: {
		type: Date,
		required: false
	}
});

module.exports = mongoose.model('Report', Schema);