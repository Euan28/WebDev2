//dependencies 
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//data inputted into the database, validations, for a new user when registering
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});

//authenticate input against database, return the user if found, if there is not user then an error message will be displayed, if all is good
//bcrypt module will be used to compare the password before hashing it in the next function
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({
            email: email
        })
        .exec(function(err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;