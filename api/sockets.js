module.exports = function({ io }) {
  const Socket = io.of('/att')
  let sockets = []
  Socket.on('connection', function(socket) {
    const socketId = shortid.generate
    sockets.push({ socketId, socket })
    socket.on('usuario-profesor', function({}) {
    })
    socket.on('pregunta-estudiante', function({ paraleloId }) {
      socket.in(paraleloId).emit('pregunta-estudiante')
    })
    socket.on('habilitar-pregunta-profesor', function({ paraleloId, preguntaId }) {
      
    })
    socket.on('deshabilitar-pregunta-profesor', function({ paraleloId, preguntaId }) {
      
    })
    socket.on('respuesta-estudiante', function({ paraleloId }) {
      socket.in(paraleloId).emit('respuesta-estudiante')
    })
    socket.on('reconectar-estudiante', function({ }) { 
      // si esta preguntando profesor enviar la pregunta y habiliar
    })
    socket.on('reconectar-profesor', function({ }) {
      // enviar las preguntas
      // si esta preguntand, enviar las respuestas
    })
    socket.on('disconnect', function() {
      const CANTIDAD_CONECTADOS = Object.keys(io.sockets.connected).length
      logger.info(`cantidad-usuarios-conectados ${CANTIDAD_CONECTADOS}`)
      let socketDesconectado = sockets.find(socketObjeto => socketId == socketObjeto.socketId)
      sockets = sockets.filter(socketObjeto => socketId != socketObjeto.socketId)
      if (socketDesconectado) {
        // let socketIdReal = socketDesconectado['socket']['id'].split('#')[1]
        delete socketDesconectado['socket'] // .destroy() .close() .disconnect(0) .close()
        delete socketDesconectado
      }
    })
  })
}