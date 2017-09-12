var mongoose = require('mongoose'),
    schema = mongoose.Schema;

module.exports = mongoose.model(
    'online',
    new schema({
        username: String,
        last_login: Date,
        uuid: String
    })
);
