var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = mongoose.Schema({
    fromUser: {
        type: ObjectId,
        required: false,
        ref: "User"
    },
    toUser: {
        type: ObjectId,
        required: true, 
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    seenDate: {
        type: Date
    }
});

module.exports = mongoose.model('Message', Schema);