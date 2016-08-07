var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = mongoose.Schema ({
    name: {
        type: 'string',
        required: true
    },
    provinceId: {
        type: ObjectId,
        required: true,
        ref: "Province"
    },
    dateCreated: {
        type: 'Date',
        required: true,
        default: Date.now
    }, 
    dateUpdated: {
        type: 'Date',
        default: Date.now
    }
});

module.exports = mongoose.model('Couty', Schema);