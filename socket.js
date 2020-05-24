let io;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socketio not initialized');
    }
    return io;
  },
};
