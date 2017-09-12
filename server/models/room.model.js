var mongoose = require('mongoose'),
    schema = mongoose.Schema;

module.exports = mongoose.model(
    'room',
    new schema({
        name: String,
        key: String
    })
);
