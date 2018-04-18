import router from '../router'

export default {
  // SOCKETS ENVIAOS
  setSocket (state, socket) {
    state.io = socket
  },
  disconnectSocket (state) {
    state.io.emit('disconnect')
    router.push('/')
  },
  SOCKET_unirseAParalelo (state, payload) {
    state.io.emit('unirseAParalelo', { paraleloId: payload })
  },
  SOCKET_preguntaProfesor (state, payload) {
    state.io.emit('preguntaProfesor', payload)
    state.pregunta = payload
  },
  SOCKET_terminarPregunta (state, payload) {
    state.io.emit('terminarPregunta', payload)
  },
  SOCKET_cambiarParalelo (state, payload) {
    state.loading = true
    state.io.emit('cambiarParalelo', payload)
  },
  // SOCKETS RECIBIDOS
  SOCKET_UNIDO_PARALELO (state) {
    state.loggedIn = true
    router.push('/preguntas')
  },
  SOCKET_PREGUNTA_ESTUDIANTE (state, data) {
    console.log('pregunta:', data)
    const pregunta = {
      _id: data[0].preguntaId,
      texto: data[0].texto,
      destacada: false,
      createdAt: data[0].createdAt,
      creador: data[0].creador,
      paralelo: data[0].paraleloId,
      show: false
    }
    state.preguntas.push(pregunta)
    state.preguntasMostrar = state.preguntas
  },
  SOCKET_RESPUESTA_ESTUDIANTE (state, data) {
    data[0].show = false
    state.respuestas.push(data[0])
    state.respuestasMostrar = state.respuestas
  },
  SOCKET_TERMINAR_PREGUNTA (state, payload) {
    state.respuestas = []
    state.respuestasMostrar = []
    state.pregunta = ''
    state.sesionRespuestas = 'inactivo'
  },
  SOCKET_CAMBIO_PARALELO (state, payload) {
    state.paraleloActual = state.usuario.paralelos.find((paralelo) => {
      return paralelo._id === payload[0]
    })
  },
  logout (state) {
    state.loggedIn = false
    state.usuario = null
  },
  // SETTERS
  setUsuario (state, payload) {
    state.usuario = payload
    state.paraleloActual = payload.paralelos[0]
  },
  setPreguntas (state, payload) {
    for (let i = payload.length - 1; i >= 0; i--) {
      payload[i].show = false
    }
    state.preguntas = payload
    state.preguntasMostrar = payload
  },
  setEstadoPregunta (state, payload) {
    const pregunta = state.preguntas.find((pregunta) => {
      return pregunta._id === payload.id
    })
    pregunta.destacada = payload.estado
  },
  setError (state, payload) {
    state.error = payload
  },
  setSesionRespuestas (state, payload) {
    state.sesionRespuestas = payload
  },
  setRespuestas (state, payload) {
    for (var i = 0; i < payload.length; i++) {
      payload[i].show = false
    }
    state.respuestas = payload
    state.respuestasMostrar = payload
  },
  setEstadoRespuesta (state, payload) {
    const respuesta = state.respuestas.find((respuesta) => {
      return respuesta._id === payload.id
    })
    respuesta.destacada = payload.estado
  },
  setPreguntaProfesor (state, payload) {
    state.pregunta = payload
  },
  setPagina (state, payload) {
    state.pagina = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  // OTROS
  filtrar (state, payload) {
    state.filtro = payload.filtro
    if (payload.pagina === 'Preguntas') {
      if (payload.filtro === 'Todas') {
        state.preguntasMostrar = state.preguntas
      } else if (payload.filtro === 'Destacadas') {
        state.preguntasMostrar = state.preguntas.filter((pregunta) => {
          return pregunta.destacada === true
        })
      }
    } else if (payload.pagina === 'Respuestas') {
      if (payload.filtro === 'Todas') {
        state.respuestasMostrar = state.respuestas
      } else if (payload.filtro === 'Destacadas') {
        state.respuestasMostrar = state.respuestas.filter((respuesta) => {
          return respuesta.destacada === true
        })
      }
    }
  },
  buscar (state, payload) {
    if (payload.filtro === 'Todas') {
      state.preguntasMostrar = state.preguntas
    } else if (payload.filtro === 'Destacadas') {
      state.preguntasMostrar = state.preguntas.filter((pregunta) => {
        return pregunta.destacada === true
      })
    }
    state.preguntasMostrar = state.preguntasMostrar.filter((pregunta) => {
      return pregunta.texto.indexOf(payload.busqueda) >= 0
    })
  },
  filtrarRespuestas (state, payload) {
    if (payload === 'Todas') {
      state.respuestasMostrar = state.respuestas
    } else if (payload === 'Marcadas') {
      state.respuestasMostrar = state.respuestas.filter((respuesta) => {
        return respuesta.marcada === true
      })
    }
  },
  buscarRespuestas (state, payload) {
    if (payload.filtro === 'Todas') {
      state.respuestasMostrar = state.respuestas
    } else if (payload.filtro === 'Marcadas') {
      state.respuestasMostrar = state.respuestas.filter((respuesta) => {
        return respuesta.destacada === true
      })
    }
    state.respuestasMostrar = state.respuestasMostrar.filter((respuesta) => {
      return respuesta.texto.indexOf(payload.busqueda) >= 0
    })
  },
  clearError (state) {
    state.error = null
  }
}
