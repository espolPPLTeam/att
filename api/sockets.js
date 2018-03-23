module.exports = function({ io, shortid, logger }) {
  const Socket = io.of('/att')
  let sockets = []
  Socket.on('connection', function(socket) {
    const socketId = shortid.generate()
    sockets.push({ socketId, socket })
    socket.on('unirse-a-paralelo', function({ paraleloId }) {
      socket.join(`${paraleloId}`)
    })
    socket.on('pregunta-estudiante', function({ preguntaId, texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      socket.join(`${paraleloId}`)
      Socket.in(`${paraleloId}`).emit('pregunta-estudiante', { preguntaId, texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } })
    })
    socket.on('disconnect', function() {
      const CANTIDAD_CONECTADOS = Object.keys(io.sockets.connected).length
      logger.info(`cantidad-usuarios-conectados ${CANTIDAD_CONECTADOS}`)
      let socketDesconectado = sockets.find(socketObjeto => socketId == socketObjeto.socketId)
      sockets = sockets.filter(socketObjeto => socketId != socketObjeto.socketId)
      if (socketDesconectado) {
        delete socketDesconectado['socket']
        delete socketDesconectado
      }
    })
    socket.on('ping-prueba', function(mensaje) {
      socket.broadcast.emit('pong-prueba', mensaje)
    })
  })
}
