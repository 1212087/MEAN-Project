var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = mongoose.Schema ({
    
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: null
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    address: {
        type: String,
        required: false,
        default: null
    },
    provinceId: {
        type: ObjectId,
        required: false,
        default: null
    },
    coutyId: {
        type: ObjectId,
        required: false,
        default: null
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastEditDate: {
        type: Date,
        default: Date.now
    },
    lastAccessDate: {
        type: Date,
        default: Date.now
    }
});

// kiểm tra password hợp lệ
Schema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

// tạo ra mã hash
Schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = mongoose.model('User', Schema);

// tạo mã Hash cho password trước khi lưu vào database
// module.exports.createUser = function(newUser, callback) {
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash(newUser.password, salt, function(err, hash) {
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     });
// }


// Tìm user theo email
// module.exports.getUserByEmail = function(email, callback){
//     var query = {email: email};
//     User.findOne(query, callback);
// }

// Tìm user theo id
// module.exports.getUserById = function(id, callback){
//     User.findById(id, callback);
// }

// So khớp password
// module.exports.comparePassword = function(candidatePassword, hash, callback){
//     bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//         if (err) {
//             throw err;
//         }
//         else {
//             callback(null, isMatch);
//         }
//     });
// }
