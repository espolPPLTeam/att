import router from '../router'

export default {
  // SOCKETS ENVIAOS
  disconnectSocket (state) {
    state.io.emit('disconnect')
    router.push('/')
  },
  SOCKET_unirseAParalelo (state, payload) {
    state.io.emit('unirseAParalelo', { paraleloId: payload })
  },
  SOCKET_preguntaProfesor (state, payload) {
    payload.preguntaId = payload.id
    state.io.emit('preguntaProfesor', payload)
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
    const pregunta = {
      id: data[0].preguntaId,
      texto: data[0].texto,
      createdAt: data[0].createdAt,
      creador: data[0].creador,
      paralelo: data[0].paraleloId,
      show: false,
      calificacion: 0
    }
    state.preguntas.unshift(pregunta)
    if (state.pagina !== 'Preguntas') {
      state.preguntaNueva = true
    }
  },
  SOCKET_RESPUESTA_ESTUDIANTE (state, data) {
    data[0].show = false
    state.respuestas.unshift(data[0])
    if (state.pagina !== 'Respuestas') {
      state.respuestaNueva = true
    }
    if (state.filtro === 'Todas') {
      state.respuestasMostrar = state.respuestas
    }
  },
  SOCKET_TERMINAR_PREGUNTA (state, payload) {
    state.respuestas = []
    state.respuestasMostrar = []
    state.pregunta = {texto: ''}
    state.sesionRespuestas = 'inactivo'
  },
  SOCKET_CAMBIO_PARALELO (state, payload) {
    state.paraleloActual = state.usuario.paralelos.find((paralelo) => {
      return paralelo.id === payload[0]
    })
  },
  logout (state) {
    state.loggedIn = false
    state.usuario = null
  },
  // SETTERS
  setSocket (state, socket) {
    state.io = socket
  },
  setPreguntas (state, payload) {
    for (let i = payload.length - 1; i >= 0; i--) {
      payload[i].show = false
    }
    payload.sort(function (a, b) {
      a = new Date(a.createdAt)
      b = new Date(b.createdAt)
      return a > b ? -1 : a < b ? 1 : 0
    })
    state.preguntas = payload
    state.preguntasMostrar = payload
  },
  setSesionRespuestas (state, payload) {
    state.sesionRespuestas = payload
  },
  setPreguntaProfesor (state, payload) {
    state.pregunta = payload
  },
  setRespuestas (state, payload) {
    for (let i = 0; i < payload.length; i++) {
      payload[i].show = false
    }
    payload.sort(function (a, b) {
      a = new Date(a.createdAt)
      b = new Date(b.createdAt)
      return a > b ? -1 : a < b ? 1 : 0
    })
    state.respuestas = payload
    state.respuestasMostrar = payload
  },
  setUsuario (state, payload) {
    state.usuario = payload
  },
  setParaleloActual (state, payload) {
    state.paraleloActual = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setPagina (state, payload) {
    state.pagina = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setEstadoPregunta (state, payload) {
    const pregunta = state.preguntas.find((pregunta) => {
      return pregunta._id === payload.id
    })
    pregunta.destacada = payload.estado
  },
  setEstadoRespuesta (state, payload) {
    const respuesta = state.respuestas.find((respuesta) => {
      return respuesta._id === payload.id
    })
    respuesta.destacada = payload.estado
  },
  setPreguntaNueva (state, payload) {
    state.preguntaNueva = payload
  },
  setRespuestaNueva (state, payload) {
    state.respuestaNueva = payload
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
  }
}
