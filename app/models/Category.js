var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    desctription: {
        type: 'String',
        required: false
    },
    dateCreated: {
        type: 'Date',
        required: true
    },
    dateUpdated: {
        type: 'Date',
        default: Date.now
    }
});

module.exports = mongoose.model('Category', Schema);