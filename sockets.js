let readyPlayersCount = 0;
function listen(io) {
    let pongNameSpace = io.of('/pong');
    //this event is listening for a successful client connection
    //the socket arg passed in the callback is from the CLIENT
    pongNameSpace.on('connection', (socket) => {
        console.log("connected at", pongNameSpace);

        socket.on('ready', () => {
            let room = "room " + readyPlayersCount / 2;
            socket.join(room);
            readyPlayersCount++;
            console.log(`player ${readyPlayersCount} ready. id=`, socket.id);
            socket.emit("PlayerReady", { readyPlayersCount, _id: socket.id });

            if (readyPlayersCount % 2 === 0) {
                //broadcast a message to all clients
                pongNameSpace.emit("StartGame", socket.id);
                console.log(readyPlayersCount);
            }
        })

        socket.on('PaddleMove', (paddlePositionData) => {
            //broadcast a message to all clients- except the sender
           // console.log(paddlePositionData);
            socket.broadcast.emit("paddleMoveDataClient", paddlePositionData);
        })

        socket.on("BallMove", (ballData) => {
            //broadcast the ball position,score to the non- referee player
            socket.broadcast.emit("BallMoveClient", ballData);
        })

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} Disconnected. Reason- ${reason}`);
        })
    })
}

module.exports = {
    listen
}
