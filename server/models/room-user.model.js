var mongoose = require('mongoose'),
    schema = mongoose.Schema;

module.exports = mongoose.model(
    'room-users',
    new schema({
        username: String,
        chatroom: String,
        join_date: Date,
        uuid: String
    })
);
