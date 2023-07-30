let { Server } = require('socket.io');
let httpServer = require('http').createServer();
let readyPlayersCount = 0;
let io = new Server(httpServer, {
    cors: {
        origin: true,
        methods: [ 'GET', 'POST', 'DELETE' ]
    }
});
//this event is listening for a successful client connection
//the socket arg passed in the callback is from the CLIENT
io.on('connection', (socket) => {
    // console.log(socket.handshake);

    socket.on('ready', () => {
        readyPlayersCount++;
        console.log(`player ${readyPlayersCount} ready. id=`, socket.id);
        if (readyPlayersCount === 2) {
            //broadcast a message to all clients
            io.emit("StartGame", socket.id);
            console.log(readyPlayersCount);
        }
    })

    socket.on('PaddleMove', (paddlePositionData) => {
         //broadcast a message to all clients- except the sender
        console.log(paddlePositionData);
        socket.broadcast.emit("paddleMoveDataClient", paddlePositionData);
    })
});

httpServer.listen(3500, () => console.log("server  listening on port 3500"));

