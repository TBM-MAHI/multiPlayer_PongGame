MultiPlayer Pong Game
==============================
## Features
- ##### This is a Backend oriented project implemented with NodeJS and Socket.IO library.
- ##### `Socket.IO` is a library that enables low-latency, bidirectional and event-based communication between a client and a server.
- ##### The frontend is render using the `Canvas` WEB API and animation is done using the `requestAnimationFrame` WEB API.
- #####  This game supports 2 player/clients in a room (`room` is an advanced feature of *Socket.IO*). So, multiple pairs of clients can play in different rooms simultaneously.
- ##### Player labels (You and opponent ) are displayed accordingly on both sides( players ).
- ##### After Game is over if 1 player press `play again button` that player will be shown the `waiting...` screen.The game will not start until other player has also pressed the `play again button`.
- ##### Currently the Game winning score is set to `7`.

## Installation

#### Run the following commands to run this project on localhost

```sh
git clone https://github.com/TBM-MAHI/multiPlayer_PongGame/
cd multiPlayer_PongGame
```
#### install dependencies

```sh
npm install
```
#### run client and server both
```sh
npm run start
```
#### run client and server in watch Mode
```sh
npm run watch
```
Now, load this URL http://localhost:3500/ in the Browser. It will show the `waiting` screen.<br>Open a new tab/window  with the same URL and the game will begin.


### Video Demo

https://github.com/TBM-MAHI/multiPlayer_PongGame/assets/101706158/7d49af94-b486-4e00-9665-e45f087dabba

