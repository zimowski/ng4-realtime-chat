var mongoose = require('mongoose'),
    onlineModel = require('../models/online.model');

function set(data) {
    return new onlineModel(data).save((error) => {
        if (error) return false;
        return true;
    });
}

function get(query, callback) {
    return onlineModel
        .find(query, null, { sort: { username: 1 } }, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
}

function remove(uuid) {
    var query = (uuid) ? { uuid: uuid } : {};
    return onlineModel
        .remove(query, function (error, removed) {
            if (error) return false;
            return true;
        });
}

function count(callback) {
    return onlineModel
        .count({}, function (error, counter) {
            callback(counter);
        });
}

module.exports = {
    set: set,
    get: get,
    remove: remove,
    count: count
};

