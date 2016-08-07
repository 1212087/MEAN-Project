var mongoose = require('mongoose');

var Schema = mongoose.Schema ({
    name: {
        type: 'string',
        required: true
    },
    desctription: {
        type: 'String',
        required: false
    },
    area: {
        type: 'String',
        required: true
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

module.exports = mongoose.model('Province', Schema);