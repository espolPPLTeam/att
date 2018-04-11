import router from '../router'

export default {
  setSocket (state, socket) {
    state.io = socket
  },
  disconnectSocket (state) {
    state.io.emit('disconnect')
    router.push('/')
  },
  SOCKET_preguntaEstudiante (state, data) {
    state.io.emit('preguntaEstudiante', data)
  },
  SOCKET_unirseAParalelo (state) {
    state.io.emit('unirseAParalelo', { paraleloId: state.usuario.paraleloId })
  },
  SOCKET_responder (state, payload) {
    state.io.emit('responder', payload)
  },
  SOCKET_UNIDO_PARALELO (state) {
    state.loggedIn = true
    router.push('/preguntar')
  },
  SOCKET_PREGUNTA_PROFESOR (state, payload) {
    state.preguntaProfesor = payload[0]
  },
  SOCKET_TERMINAR_PREGUNTA (state, payload) {
    state.preguntaProfesor = null
    state.respuesta = null
  },
  logout (state) {
    state.loggedIn = false
    state.usuario = null
    state.preguntaProfesor = null
    state.preguntas = []
    state.respuesta = null
  },
  setPreguntas (state, payload) {
    state.preguntas = payload
    for (var i = 0; i < state.preguntas.length; i++) {
      state.preguntas[i].estado = 'enviada'
    }
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
  setPreguntaProfesor (state, payload) {
    state.preguntaProfesor = {
      _id: payload._id,
      createdAt: payload.createdAt,
      texto: payload.texto
    }
  },
  setRespuesta (state, payload) {
    state.respuesta = {
      texto: payload.texto,
      createdAt: payload.createdAt,
      estado: payload.estado
    }
  },
  anadirRespuesta (state, payload) {
    payload.estado = 'enviando'
    state.respuesta = payload
  },
  setEstadoRespuesta (state, payload) {
    state.respuesta.estado = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setUsuario (state, payload) {
    state.usuario = {
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      correo: payload.correo,
      matricula: payload.matricula,
      paraleloId: payload.paraleloId
    }
  }
}
