var mongoose = require('mongoose'),
    schema = mongoose.Schema;

module.exports = mongoose.model(
    'room-messages',
    new schema({
        username: String,
        message: String,
        type: String,
        chatroom: String,
        date: Date
    })
);
