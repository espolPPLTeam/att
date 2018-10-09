import Vue from 'vue'

const state = {
  preguntaProfesor: null,
  respuesta: null
}

const getters = {
  preguntaProfesor (state) {
    return state.preguntaProfesor
  },
  respuesta (state) {
    return state.respuesta
  }
}

const mutations = {
  setPreguntaProfesor (state, payload) {
    state.preguntaProfesor = {
      preguntaId: payload._id,
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
  }
}

const actions = {
  responder ({commit, state, rootState}, payload) {
    commit('setError', null)
    const data = {
      paraleloId: rootState.paraleloActual._id,
      preguntaId: state.preguntaProfesor.preguntaId,
      texto: payload,
      creador: {
        email: rootState.usuario.email,
        matricula: rootState.usuario.matricula,
        nombres: rootState.usuario.nombres,
        apellidos: rootState.usuario.apellidos,
        _id: rootState.usuario._id
      },
      createdAt: new Date()
    }
    commit('anadirRespuesta', data)
    const urlApi = '/api/att/estudiante/responder'
    Vue.http.post(urlApi, data)
      .then((response) => {
        if (response.body.estado) {
          commit('setEstadoRespuesta', 'enviada')
          commit('SOCKET_responder', data)
        } else {
          commit('setError', response.body)
          commit('setEstadoRespuesta', 'no enviada')
        }
      }, (err) => {
        console.log(err)
        commit('setError', err)
        commit('setEstadoRespuesta', 'no enviada')
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
