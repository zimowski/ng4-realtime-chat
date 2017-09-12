var onlineService = require('./online.service');

function counter() {
    onlineService.count((count) => {
        console.log('Users online: ' + count);
    });
}

function userJoin(user) {
    console.log(`${user.username} join to chat`);
    counter();
}

function userLeft(user) {
    console.log(`${user.username} left from chat`);
    counter();
}

module.exports = {
    userJoin: userJoin,
    userLeft: userLeft
};
