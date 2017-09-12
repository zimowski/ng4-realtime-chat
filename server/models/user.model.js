var mongoose = require('mongoose'),
    schema = mongoose.Schema;

module.exports = mongoose.model(
    'users',
    new schema({
        username: String,
        _password: String,
        _salt: String,
        gender: String,
        city: String,
        register: Date,
        image: String
    })
);
