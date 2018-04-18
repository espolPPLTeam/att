module.exports = function({ io, shortid, logger }) {
  const Socket = io.of('/att')
  let sockets = []
  Socket.on('connection', function(socket) {
    const socketId = shortid.generate()
    sockets.push({ socketId, socket })
    socket.on('unirseAParalelo', function({ paraleloId }) {
      socket.join(`${paraleloId}`)
      // TODO: eliminar el true enviado
      socket.emit('UNIDO_PARALELO', true)
    })
    socket.on('preguntaEstudiante', function({ preguntaId, texto, paraleloId, createdAt, creador: { _id, correo, matricula, nombres, apellidos } }) {
      Socket.in(`${paraleloId}`).emit('PREGUNTA_ESTUDIANTE', { preguntaId, texto, paraleloId, createdAt, creador: { _id, correo, matricula, nombres, apellidos } })
    })
    /*
     * el profesor hace una pregunta y debe ser enviado a todos los profesores ademas de los estudiantes
    */
    // FIX: si una pregunta esta hecha y corriendo, no debe poder hacerse otra
    socket.on('preguntaProfesor', function({ paraleloId, preguntaId, texto, creador: { nombres, apellidos, tipo, correo } }) {
      Socket.in(`${paraleloId}`).emit('PREGUNTA_PROFESOR', { paraleloId, preguntaId, texto, creador:{ nombres, apellidos, tipo, correo } })
    })
    // lo que el estudiante envia al profesor
    socket.on('responder', function({ paraleloId, texto, preguntaId, createdAt, creador: { nombres, apellidos, tipo, correo } }) {
      Socket.in(`${paraleloId}`).emit('RESPUESTA_ESTUDIANTE', { paraleloId, texto, preguntaId, createdAt, creador: { nombres, apellidos, tipo, correo } })
    })
    socket.on('terminarPregunta', function({ paraleloId, preguntaId, terminadoPor: { nombres, apellidos, tipo, correo } }) {
     Socket.in(`${paraleloId}`).emit('TERMINAR_PREGUNTA', { paraleloId, preguntaId, terminadoPor: { nombres, apellidos, tipo, correo } }) 
    })
    socket.on('cambiarParalelo', function({paraleloAntiguo, paraleloNuevo}) {
      socket.leave(`${paraleloAntiguo}`)
      socket.join(`${paraleloNuevo}`)
      socket.emit('CAMBIO_PARALELO', paraleloNuevo)
    })
    socket.on('disconnect', function() {
      const CANTIDAD_CONECTADOS = Object.keys(io.sockets.connected).length
      logger.info(`cantidad-usuarios-conectados ${CANTIDAD_CONECTADOS}`)
      Socket.emit('CANTIDAD_CONECTADOS', CANTIDAD_CONECTADOS)
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
