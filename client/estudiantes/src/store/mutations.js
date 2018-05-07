import router from '../router'

export default {
  // SOCKETS ENVIADOS
  disconnectSocket (state) {
    state.io.emit('disconnect')
    router.push('/')
  },
  SOCKET_preguntaEstudiante (state, payload) {
    state.io.emit('preguntaEstudiante', payload)
  },
  SOCKET_unirseAParalelo (state) {
    state.io.emit('unirseAParalelo', { paraleloId: state.usuario.paraleloId })
  },
  SOCKET_responder (state, payload) {
    state.io.emit('responder', payload)
  },
  // SOCKETS RECIBIDOS
  SOCKET_UNIDO_PARALELO (state) {
    state.loggedIn = true
    router.push('/preguntar')
  },
  SOCKET_PREGUNTA_PROFESOR (state, payload) {
    state.preguntaProfesor = payload[0]
    if (state.pagina !== 'Responder') {
      state.preguntaProfesorNueva = true
    }
  },
  SOCKET_TERMINAR_PREGUNTA (state, payload) {
    state.preguntaProfesor = null
    state.respuesta = null
  },
  // SETTERS
  setSocket (state, socket) {
    state.io = socket
  },
  setUsuario (state, payload) {
    state.usuario = {
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      correo: payload.correo,
      matricula: payload.matricula,
      paraleloId: payload.paraleloId
    }
  },
  setPreguntas (state, payload) {
    state.preguntas = payload
    for (var i = 0; i < state.preguntas.length; i++) {
      state.preguntas[i].estado = 'enviada'
    }
  },
  setPreguntaProfesor (state, payload) {
    state.preguntaProfesor = {
      preguntaId: payload.preguntaId,
      createdAt: payload.fechaCreadaPregunta,
      texto: payload.texto
    }
  },
  setPreguntaProfesorNueva (state, payload) {
    state.preguntaProfesorNueva = payload
  },
  setRespuesta (state, payload) {
    state.respuesta = {
      texto: payload.texto,
      createdAt: payload.createdAt,
      estado: payload.estado
    }
  },
  setError (state, payload) {
    state.error = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setPagina (state, payload) {
    state.pagina = payload
  },
  logout (state) {
    state.loggedIn = false
    state.usuario = null
    state.preguntaProfesor = null
    state.preguntas = []
    state.respuesta = null
  },
  anadirPregunta (state, payload) {
    state.preguntas.push(payload)
  },
  preguntaEnviada (state, payload) {
    let pregunta = state.preguntas.find((pregunta) => {
      return pregunta.createdAt === payload.createdAt && pregunta.texto === payload.texto
    })
    pregunta.estado = 'enviada'
  },
  preguntaNoEnviada (state, payload) {
    let pregunta = state.preguntas.find((pregunta) => {
      return pregunta.createdAt === payload.createdAt && pregunta.texto === payload.texto
    })
    pregunta.estado = 'no enviada'
  },
  anadirRespuesta (state, payload) {
    payload.estado = 'enviando'
    state.respuesta = payload
  },
  setEstadoRespuesta (state, payload) {
    state.respuesta.estado = payload
  }
}
