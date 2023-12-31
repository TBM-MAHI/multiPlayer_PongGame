let readyPlayersCount = 0;
function listen(io) {
    let pongNameSpace = io.of('/pong');
    let room;
   /*  this event is listening for a successful client connection
    the socket arg passed in the callback is from the CLIENT */
    pongNameSpace.on('connection', (socket) => {
        console.log("connected at /pong");
        const totalClients = pongNameSpace.sockets.size;
       // console.log("total clients", totalClients);
        socket.on('ready', () => {
            room = "room " + Math.floor(readyPlayersCount / 2);
            socket.join(room);
            readyPlayersCount++;
            console.log(`player ${readyPlayersCount} ready in Room ${room}. id=`, socket.id);

            //to the sender itself- the client who emitted the event
            socket.emit("PlayerReady", { readyPlayersCount, _id: socket.id });
            if (readyPlayersCount % 2 === 0) {
                //broadcast a message to all clients in /pong namespace and in room1
                pongNameSpace.in(room).emit("StartGame", socket.id);
            }
        });

        socket.on('startGame', ({ clientID }) => {
            pongNameSpace.in(room).emit("StartGame", clientID);
        });

        socket.on('PaddleMove', (paddlePositionData) => {
            //broadcast a message to all clients- except the sender
            // console.log(paddlePositionData);
            socket.to(room).emit("paddleMoveDataClient", paddlePositionData);
        })

        socket.on('playerStatus', (data, callback) => {
            //  console.log(data);
            socket.timeout(3000).to(room).emit("playerStatusDataClient", data, (err, acknowledgement) => {
              //  console.log(`acknowledgement from playerStatusDataClient`, { acknowledgement });
                if (err)
                    console.log(err);
                if (acknowledgement && acknowledgement[ 0 ].response === "ok") {
                    callback({
                        status: "ok"
                    });
                }
            });
        });

        socket.on('BallMove', (ballData) => {
            // broadcast the ball position,score to the non-referee player
           // console.log(ballData);
            socket.to(room).emit("BallMoveClient", ballData);
        })

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} Disconnected.Reason-${reason}`);
            socket.leave(room);
        })
    })
}

module.exports = {
    listen
}
