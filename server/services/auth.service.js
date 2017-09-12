var jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt-nodejs'),
    config = require('../config'),
    onlineService = require('./online.service'),
    userModel = require('../models/user.model');

function authenticateBySocket(socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, config.api_key, function (error, decoded) {
            if (error) {
                return next(new Error('Authentication error'));
            }

            socket.user = decoded.data;
            socket.user.uuid = socket.id;

            if (!onlineService.set({
                username: socket.user.username,
                last_login: new Date(),
                uuid: socket.id
            })) {
                next(new Error('Cannot set user to online list'));
            } else {
                next();
            }
        });
    } else {
        next(new Error('Authentication error'));
    }
}

function authenticate(username, password, callback) {
    userModel.findOne({ username: username }, { __v: 0 }, function (error, user) {
        if (!user) {
            return callback(false, 'Authentication failed');
        } else {
            if (bcrypt.hashSync(password, user._salt) === user._password) {
                return callback(true, 'Authentication success', jwt.sign({
                    data: user
                }, config.api_key));
            } else {
                return callback(false, 'Authentication failed');
            }
        }
    });
}

function verifyToken(token, callback) {
    jwt.verify(token, config.api_key, function (error, decoded) {
        if (error) {
            return callback(false);
        } else {
            return callback(true, decoded);
        }
    });
}

function signup(userdata, callback) {
    userModel.find({ username: userdata.username }, function (error, users) {
        if (error) {
            return callback(false, 'Server error');
        }

        var reservedNames = ['admin', 'administrator', 'root', 'default'];

        if (reservedNames.indexOf(userdata.username.toLowerCase()) !== -1) {
            return callback(false, 'Username is invalid');
        }

        if (users.length > 0) {
            return callback(false, 'Username is already taken');
        } else {
            var salt = bcrypt.genSaltSync(),
                user = new userModel({
                    username: userdata.username,
                    _password: bcrypt.hashSync(userdata.password, salt),
                    _salt: salt,
                    gender: userdata.gender || null,
                    city: userdata.city || null,
                    register: new Date(),
                    image: 'default.jpg'
                });

                user.save(() => {
                    return callback(true);
                });
            }
        });
}

module.exports = {
    authenticateBySocket: authenticateBySocket,
    authenticate: authenticate,
    verifyToken: verifyToken,
    signup: signup
};
