require("./config/config.json");
require("./config/config");

var path = require('path');

const express = require('express');
const route = require('./route/route');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use('/', route);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join', function(data) {
        //joining
        socket.join(data.room);

        console.log(data.user + 'joined the room : ' + data.room);

        socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: ' has joined this room.' });
    });


    socket.on('leave', function(data) {

        console.log(data.user + ' left the room : ' + data.room);

        socket.broadcast.to(data.room).emit('left room', { user: data.user, message: ' has left this room.' });

        socket.leave(data.room);
    });
    socket.on('message', function(data) {
        console.log({ user: data.user, room: data.room, message: data.message });
        io.in(data.room).emit('new message', { user: data.user, message: data.message });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(process.env.PORT);
http.on('error', onError);
http.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = http.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind);
}