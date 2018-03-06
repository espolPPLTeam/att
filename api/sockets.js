module.exports = function({ io }) {
  const Socket = io.of('/att')
  let sockets = []
  Socket.on('connection', function(socket) {
    socket.on('ping', function() {
      console.log('aa')
    })
  })
}