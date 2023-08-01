let express = require('express');
let path = require('path');
let apiServer= express()

apiServer.use(express.static(path.join(__dirname, 'public')));

module.exports = apiServer;