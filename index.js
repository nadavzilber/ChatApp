var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let state = { clients: {} };

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    const { id } = socket.client;
    state.clients[id] = { name: id };

    io.emit('update clients', {
        text: 'user connected: ' + id,
        clients: Object.values(state.clients)
    });

    socket.on('disconnect', () => {
        const { id } = socket.client;
        delete state.clients[id];
        io.emit('update clients', {
            text: 'user disconnected: ' + id,
            clients: Object.values(state.clients)
        });
    });

    socket.on('chat message', (msg) => {
        const { id } = socket.client;
        const clientName = state.clients[id].name;
        socket.broadcast.emit('chat message', {
            sender: clientName,
            text: msg
        });
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});