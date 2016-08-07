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
        required: true,
        ref: 'User'
    },
    address: {
        type: String,
        required: true
    },
    provinceId: {
        type: ObjectId,
        required: true,
        ref: "Province"
    },
    coutyId: {
        type: ObjectId,
        required: true,
        ref: "Couty"
    },
    categoryId: {
        type: ObjectId,
        required: true,
        ref: "Category"
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
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastUpdateDate: {
        type: Date,
        default: Date.now
    }, 
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Post', Schema);