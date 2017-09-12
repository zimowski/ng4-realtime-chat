var mongoose = require('mongoose'),
    messagesModel = require('../models/room-message.model'),
    roomModel = require('../models/room.model'),
    roomUserModel = require('../models/room-user.model');

function getMessages(chatroom, callback) {
    return messagesModel
        .find({ chatroom: chatroom }, { __v: 0 }, { limit: 100, sort: { date: -1 } }, function (error, result) {
            if (error) return callback(false);
            result.sort(
              function(a, b) {
                  const first = a.date;
                  const second = b.date;
                  return first < second ? -1 : first > second ? 1 : 0;
              }
            );
            return callback(result);
        });
}

function set(data, callback) {
    return new messagesModel(data).save((error) => {
        if (error) return callback(false);
        return callback(true);
    });
}

function roomList(callback) {
    return roomModel
        .find({ }, { __v: 0 }, { }, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
}

function getRoom(room) {
    return roomModel
        .findOne({ key: room }, { __v: 0 }, { }, function (error, result) {
            if (error) return false;
            return result;
        });
}

function getUsers(query, callback) {
    return roomUserModel
        .find(query, null, { sort: { username: 1 } }, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
}

function join(room, user, uuid, callback) {
    return new roomUserModel({
        username: user,
        chatroom: room,
        join_date: new Date(),
        uuid: uuid
    }).save((error) => {
        if (error) return callback(false);
        return callback(true);
    });
}

function leave(room, uuid, callback) {
    return roomUserModel
        .remove({ uuid: uuid, chatroom: room }, function (error, removed) {
            if (error) return callback(false);
            return callback(true);
        });
}

function removeJoinedUser(uuid) {
    var query = (uuid) ? { uuid: uuid } : {};
    return roomUserModel
        .remove(query, function (error, removed) {
            if (error) return false;
            return true;
        });
}


module.exports = {
    getMessages: getMessages,
    set: set,
    roomList: roomList,
    getRoom: getRoom,
    join: join,
    removeJoinedUser: removeJoinedUser,
    getUsers: getUsers,
    leave: leave
}
