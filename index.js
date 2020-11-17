var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let state = { clients: {} };

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    const { id } = socket.client;
    state.clients[id] = { name: id };

    io.emit('chat message', {
        sender: 'System',
        text: 'user connected: ' + id
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('chat message', {
            sender: 'System',
            text: 'user disconnected.'
        });
    });

    socket.on('chat message', (msg) => {
        const { id } = socket.client;
        const clientName = state.clients[id].name;
        io.emit('chat message', {
            sender: clientName,
            text: msg
        });
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});