var formidable = require('formidable'),
    move = require('mv'),
    authService = require('../services/auth.service'),
    userModel = require('../models/user.model');

function upload(request, callback) {
    if (request.headers && request.headers.token) {
        authService.verifyToken(request.headers.token, function (status, userdata) {
            if (!status) {
                return callback(false, 'Authentication failed');
            }
            var form = new formidable.IncomingForm();
            form.parse(request, function (err, fields, files) {
                if (err) {
                    return callback(false, 'Cannot parse form');
                }
                var oldpath = files.profileImage.path;
                var newpath = 'assets/' + userdata.data.username + '.jpg';
                move(oldpath, newpath, function(err) {
                    if (err) {
                        return callback(false, 'Can\'t move file to destination folder');
                    }
                    userModel.update({ _id: userdata.data._id }, { image: userdata.data.username + '.jpg' }, function (err, res) {
                        if (err) {
                            return callback(false, 'Fail update profile');
                        } else {
                            return callback(true);
                        }
                    });
                });
            });
        });
    } else {
        return callback(false, 'Authentication failed');
    }
}

module.exports = {
    upload: upload
};
