var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed    = mongoose.Schema.Types.Mixed;

var Schema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    userId: {
        type: ObjectId,
        required: true
    },
    province: {
        type: Mixed,
        required: true
    },
    couty: {
        type: Mixed,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    category: {
        type: Mixed,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    picture: {
        type: Mixed,
        required: true
    },
    morePictures: {
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
});

module.exports = mongoose.model('Post', Schema);