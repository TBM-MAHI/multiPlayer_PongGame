let { Server } = require('socket.io');
let { listen } = require('./sockets');

let apiServer = require('./api');
let httpServer = require('http').createServer(apiServer);

let socketSever = new Server(httpServer, {
    cors: {
        origin: true,
        methods: [ 'GET', 'POST', 'DELETE' ]
    }
});

httpServer.listen(3500, () => console.log("server  listening on port 3500"));

//call function to listen on sockets
listen(socketSever);

