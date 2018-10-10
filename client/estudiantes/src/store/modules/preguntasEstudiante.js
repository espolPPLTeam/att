import Vue from 'vue'

const state = {
  preguntas: []
}

const getters = {
  preguntas (state, getters, rootState) {
    let preguntas = state.preguntas.filter((pregunta) => {
      return pregunta.paralelo === rootState.paraleloActual._id
    })
    return preguntas.sort((preguntaA, preguntaB) => {
      return preguntaA.createdAt > preguntaB.createdAt
    })
  }
}

const mutations = {
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
  }
}

const actions = {
  anadirPregunta ({commit, state, rootState}, payload) {
    // Primero se añade la pregunta al array. Con estado 'enviando'
    const data = {
      texto: payload.texto,
      createdAt: payload.createdAt,
      paralelo: rootState.paraleloActual._id,
      creador: rootState.usuario,
      estado: payload.estado,
      paraleloId: rootState.paraleloActual._id
    }
    commit('anadirPregunta', data)
    // Se envía la pregunta a la base de datos
    Vue.http.post('/api/att/estudiante/preguntar', data)
      .then((response) => {
        if (response.body.estado) {
          commit('preguntaEnviada', payload)
          data.preguntaId = response.body.datos.id
          // commit('SOCKET_preguntaEstudiante', data)
        } else {
          commit('preguntaNoEnviada', payload)
          commit('setError', response.body)
        }
      }, (err) => {
        console.log('err:', err)
        commit('setError', err)
        commit('preguntaNoEnviada', payload)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
