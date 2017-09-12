# Angular 4 real-time chat
A real-time chat with multiple rooms and user authentication. Build on websockets.

## Example screenshots
![demo](https://user-images.githubusercontent.com/23633235/30330761-3c567000-97d6-11e7-9d9e-a9f919f228b4.gif)

## Built with
* Client side
  * [Angular 4](https://angular.io)
  * [Angular Material](https://material.angular.io)
* Server side
  * [Node.JS](http://nodejs.org)
  * [ExpressJS](https://github.com/expressjs/express)
  * [Socket.io](https://github.com/socketio/socket.io)
  * [Json Web Token](https://www.npmjs.com/package/jsonwebtoken)
  * [MongoDB](https://github.com/mongodb/mongo)

## Project status
In progress...
### TODO
- [x] Multiple rooms
- [ ] Verify user data at signup
- [ ] Resize profile image after send
- [ ] Send new profile image to users
- [ ] Add edit profile
- [ ] Add change password
- [ ] Private messages

## Installation
Before installation you need Node.JS, MongoDB and Angular CLI.

Remember to run MongoDB.

1. Download or clone respository.
2. Install project dependencies in `/server/` and `/client/` directories using `npm install` from command line.
3. In MongoDB create collection `rooms` and insert default room:
   ```JavaScript
   db.getCollection("rooms").insert({
    "name": "Global",
    "key": "global"
   })
   ```
3. Use `node .` in `/server/` directory to run node.js server. The server will return
   > Server listen on port 3000
3. Use `ng serve` in `client` directory or `ng build --prod` if you wan't put chat on server.
4. Open http://localhost:4200

## Configure

### Server side
The config variables located in `/server/config.js`. Set API KEY and select correct database.
```JavaScript
module.exports = {
    'port': 3000,
    'api_key': '[!YOUR_API_KEY_HERE!]',
    'database': 'mongodb://localhost:27017/ng4-realtime-chat'
};
```

### Client side
The config variables located in `/client/src/app/app.config.ts`.
You can change server address, default room or page title.
```JavaScript
  public apiUrl: String = 'http://localhost:3000';
  public defaultChatroom: RoomModel = {
    name: 'Global',
    key: 'global'
  };
  public pageTitle: String = 'Chat';
```
If you wan't change default room, remember - you need chatroom in database (collection `rooms`).

## Author
Sebastian Zimowski --- zimowski.it

## License
MIT
