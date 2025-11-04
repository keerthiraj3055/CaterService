const app = require('./app');
const logger = require('./config/logger');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// initialize socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// make io available to controllers via app.set('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  // allow client to join a room (e.g., 'admins')
  socket.on('join-room', (room) => {
    socket.join(room);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
