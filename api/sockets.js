module.exports = function({ io, shortid, logger }) {
  const Socket = io.of('/att')
  let sockets = []
  Socket.on('connection', function(socket) {
    const socketId = shortid.generate()
    sockets.push({ socketId, socket })
    socket.on('unirseAParalelo', function({ paraleloId }) {
      socket.join(`${paraleloId}`)
      socket.emit('UNIDO_PARALELO', true)
    })
    socket.on('preguntaEstudiante', function({ preguntaId, texto, paraleloId, createdAt, creador: { _id, correo, matricula, nombres, apellidos } }) {
      Socket.in(`${paraleloId}`).emit('PREGUNTA_ESTUDIANTE', { preguntaId, texto, paraleloId, createdAt, creador: { _id, correo, matricula, nombres, apellidos } })
      // Socket.emit('PREGUNTA_ESTUDIANTE', { preguntaId, texto, paraleloId, createdAt, creador: { _id, correo, matricula, nombres, apellidos } })
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
    socket.on('pingPrueba', function(mensaje) {
      socket.broadcast.emit('pongPrueba', mensaje)
    })
  })
}
