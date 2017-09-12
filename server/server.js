// Dependencies
var server = require('express')(),
    express = require('express'),
    http = require('http').Server(server),
    fs = require('fs'),
    io = require('socket.io')(http),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    cors = require('cors'),
// Config
    config = require('./config'),
    port = process.env.PORT || config.port,
// Models
    userModel = require('./models/user.model'),
    roomUserModel = require('./models/room-user.model'),
// Services
    onlineService = require('./services/online.service'),
    loggerService = require('./services/logger.service'),
    authService = require('./services/auth.service'),
    roomService = require('./services/room.service'),
// Modules
    avatarModule = require('./modules/avatar.module');

mongoose.connect(config.database, {
    useMongoClient: true
});

// Front-end domains accepted
server.use(cors({
  origin: 'http://localhost:4200',
  preflightContinue: true
}));
server.set('api_key', config.api_key);
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());
server.use(morgan('dev'));

// Secure socket connection
io.use(function (socket, next) {
    return authService.authenticateBySocket(socket, next);
});

// Serve static - profile photos
// If doesn't exist - show default.jpg
server.get('/assets/:filename', function(req, res) {
    if (req.params && req.params.filename) {
        res.sendFile(__dirname + '/assets/' + ((fs.existsSync('assets/' + req.params.filename) ? req.params.filename : 'default.jpg')));
    } else {
        res.send('');
    }
});

server.get('/', function(req, res) {
    res.send('');
});

// Profile photos upload
server.post('/image-upload', function(request, response) {
    avatarModule.upload(request, function (status, res) {
        response.json({
            status: status,
            response: res
        });
    })
});

// User signup
server.post('/signup', (request, response) => {
    // TODO VALIDATE FORM
    var data = request.body.data;
    if (!data.username || !data.password) {
        response.json({
            status: false,
            response: 'Username and password required'
        });
    } else {
        authService.signup({
            username: data.username,
            password: data.password,
            gender: data.gender || null,
            city: data.city || null
        }, function (status, res) {
            response.json({
                status: status,
                response: 'Signup success!'
            });
        });
    }
});

// User authentication
server.post('/authenticate', (request, response) => {
    if (!request.body.username || !request.body.password) {
        response.json({
            status: false,
            response: 'Authentication failed. Username and password required'
        });
    } else {
        authService.authenticate(request.body.username, request.body.password, function (status, res, token) {
            response.json({
                status: status,
                response: res,
                token: token
            });
        });
    }
});

// Verify user token when refresh page
server.post('/verify', (request, response) => {
    if (request.body && request.body.token) {
        authService.verifyToken(request.body.token, function (status) {
            response.json({
                status: status
            });
        });
    } else {
        response.json({
            status: false
        });
    }
});

// Socket connection with user
io.on('connection', function(socket) {
    loggerService.userJoin(socket.user);

    // When user left chat - remove from global users list
    socket.on('disconnect', function () {
        // Remove from online list
        onlineService.remove(socket.user.uuid)
            .then((result) => {
                loggerService.userLeft(socket.user);
            });

        // Left user from joined rooms
        roomService.getUsers({ uuid: socket.user.uuid }, function (result) {
            for (var client of result) {
                io.sockets.in(client.chatroom).emit('room', {
                    type: 'leave',
                    room: client.chatroom,
                    data: socket.user
                });
            }
            return Promise.resolve();
        }).then(function () {
            // Remove user from joined rooms in database
            roomService.removeJoinedUser(socket.user.uuid);
        });
    });

    // Emit rooms list
    roomService.roomList(function(list) {
        socket.emit('room', {
            type: 'list',
            room: null,
            data: list
        });
    });

    socket.on('room', function (request) {
        switch (request.type) {
            case 'subscribe':
                // emit juser join to chat
                roomService.getRoom(request.room)
                    .then(function (details) {
                        socket.join(request.room);
                        if(socket.emit('room', {
                            type: 'subscribe',
                            room: request.room,
                            data: details
                        })) {
                            return Promise.resolve();
                        }
                    }).then(function () {
                        if(io.sockets.in(request.room).emit('room', {
                            type: 'join',
                            room: request.room,
                            data: socket.user
                        })) {
                            return Promise.resolve();
                        }
                    }).then(function () {
                        roomService.getUsers({ chatroom: request.room }, function (result) {
                            result.map((item) => {
                                userModel.findOne({ username: item.username }, { __v: 0, _password: 0, _salt: 0 }, function (error, user) {
                                    var emitUser = JSON.parse(JSON.stringify(user)); // Copy without reference
                                    emitUser.uuid = item.uuid;
                                    if(socket.emit('room', {
                                        type: 'join',
                                        room: request.room,
                                        data: emitUser
                                    })) {
                                        return Promise.resolve();
                                    }
                                });
                            });
                        });
                    }).then(function () {
                        roomService.join(request.room, socket.user.username, socket.user.uuid, function(status) {
                            return Promise.resolve();
                        });
                    });
                break;
            case 'fill':
                roomService.getMessages(request.room, function (result) {
                    socket.emit('room', {
                        type: 'fillChat',
                        room: request.room,
                        data: result
                    });
                });
                break;
            case 'message':
                var data = {
                    username: socket.user.username,
                    message: request.data,
                    type: 'message',
                    chatroom: request.room,
                    date: new Date()
                };

                roomService.set(data, function (status) {
                    if (status) {
                        io.sockets.in(request.room).emit('room', {
                            type: 'message',
                            room: request.room,
                            data: data
                        });
                    }
                });
                break;
            case 'leave':
                roomService.leave(request.room, socket.user.uuid, function () {
                    io.sockets.in(request.room).emit('room', {
                        type: 'leave',
                        room: request.room,
                        data: socket.user
                    });
                });
                break;
        }
    });
});

http.listen(port, () => {
    // When server start - clear online users db
    onlineService.remove();
    // Clear room joined users list
    roomService.removeJoinedUser();
    console.log(`Server listen on port ${port}`);
});
