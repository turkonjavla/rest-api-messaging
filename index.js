const express = require('express');
const http = require('http');
const socketio = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketio.init(server);

const { HOST, PORT } = require('./keys');

const Middleware = require('./middleware');
Middleware(app);

const feed = require('./routes/feed');
const auth = require('./routes/auth');

app.use('/feed', feed);
app.use('/auth', auth);

io.on('connection', socket => {
  console.log('A user connected');
});

server.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`);
});
