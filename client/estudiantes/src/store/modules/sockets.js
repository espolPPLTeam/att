import router from '../../router'

const state = {
  io: null
}

const getters = {

}

const mutations = {
  // SOCKETS ENVIADOS
  disconnectSocket (state) {
    state.io.emit('disconnect')
    router.push('/')
  },
  SOCKET_preguntaEstudiante (state, payload) {
    state.io.emit('preguntaEstudiante', payload)
  },
  SOCKET_unirseAParalelo (state, paraleloId) {
    state.io.emit('unirseAParalelo', { paraleloId })
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
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
