import router from '../../router'
// initial state
const state = {
  io: null
}

// getters
const getters = {
  preguntas (state) {
    return state.preguntas
  }
}

// actions
const actions = {
  socket_preguntaEstudiante ({commit, state, rootState}, data) {
    const pregunta = {
      id: data.preguntaId,
      texto: data.texto,
      createdAt: data.createdAt,
      creador: data.creador,
      paralelo: data.paraleloId,
      show: false,
      calificacion: 0
    }
    commit('preguntas/addPregunta', pregunta, { root: true })
    if (rootState.pagina !== 'Preguntas') {
      commit('setPreguntaNueva', true, { root: true })
    }
  },
  socket_unidoParalelo ({ state, commit, rootState }, payload) {
    commit('setLoggedIn', true, { root: true })
    router.push('/preguntas')
  },
  socket_cambioParalelo ({state, commit, rootState}, payload) {
    let paralelo = rootState.usuario.paralelos.find((paralelo) => {
      return paralelo.id === payload
    })
    commit('setParaleloActual', paralelo, { root: true })
  },
  socket_respuestaEstudiante ({state, commit, rootState}, data) {
    data.show = false
    commit('respuestas/addRespuesta', data, { root: true })
    if (rootState.pagina !== 'Respuestas') {
      commit('setRespuestaNueva', true, { root: true })
    }
    if (rootState.filtro === 'Todas') {
      commit('respuestas/setRespuestasMostrar', rootState.respuestas.respuestas, { root: true })
    }
  }
}

// mutations
const mutations = {
  setSocket (state, socket) {
    state.io = socket
  },
  disconnectSocket (state) {
    state.io.emit('disconnect')
    router.push('/')
  },
  unirAParalelo (state, payload) {
    state.io.emit('unirseAParalelo', { paraleloId: payload })
  },
  cambiarParalelo (state, payload) {
    state.io.emit('cambiarParalelo', payload)
  },
  preguntaProfesor (state, payload) {
    payload.preguntaId = payload.id
    state.io.emit('preguntaProfesor', payload)
  },
  terminarPregunta (state, payload) {
    state.io.emit('terminarPregunta', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
