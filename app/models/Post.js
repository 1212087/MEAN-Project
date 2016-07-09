var mongoose    = require('mongoose');
var ObjectId    = mongoose.Schema.Types.ObjectId;
var Mixed       = mongoose.Schema.Types.Mixed;

var Schema = mongoose.Schema ({
    userId: {
        type: ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: Mixed,
        required: true
    },
    moreImage: {
        type: Mixed,
        required: false
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastUpdateDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', Schema);