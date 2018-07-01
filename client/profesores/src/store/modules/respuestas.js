import Vue from 'vue'
// initial state
const state = {
  pregunta: {
    texto: ''
  }, // Pregunta que el profesor envía a los estudiantes
  respuestas: [],
  respuestasMostrar: []
}

// getters
const getters = {
  pregunta (state) {
    return state.pregunta
  },
  respuestasMostrar (state) {
    return state.respuestasMostrar
  }
}

// actions
const actions = {
  enviarPregunta ({commit, state, rootState}, payload) {
    commit('setError', null, { root: true })
    commit('setLoading', true, { root: true })
    const data = {
      paraleloId: rootState.paraleloActual.id,
      creador: rootState.usuario,
      texto: payload
    }
    Vue.http.post('/api/att/profesor/preguntar', data)
      .then((response) => {
        commit('setLoading', false, { root: true })
        if (response.body.estado) {
          data.id = response.body.datos.id
          commit('sockets/preguntaProfesor', data, { root: true })
          commit('setPreguntaProfesor', data)
          commit('setSesionRespuestas', 'activo', { root: true })
        } else {
          commit('setError', response.body, { root: true })
        }
      }, (err) => {
        commit('setLoading', false, { root: true })
        commit('setError', err, { root: true })
        console.log(err)
      })
  },
  calificarRespuesta ({commit}, payload) {
    commit('setError', null, { root: true })
    const urlApi = '/api/att/profesor/calificarRespuestaEstudiante'
    const data = {
      respuestaId: payload.id,
      calificacion: payload.calificacion
    }
    Vue.http.put(urlApi, data)
      .then((response) => {
        if (!response.body.estado) {
          commit('setError', response.body, { root: true })
          commit('calificarRespuesta', {id: payload.id, calificacion: payload.calificacionAntigua})
        }
      }, (err) => {
        commit('setError', err, { root: true })
        commit('calificarRespuesta', {id: payload.id, calificacion: payload.calificacionAntigua})
        console.log('err', err)
      })
  },
  terminarSesionRespuestas ({commit, state, rootState}) {
    commit('setError', null, { root: true })
    const urlApi = '/api/att/profesor/terminarPregunta'
    const data = {
      preguntaId: state.pregunta.id,
      paraleloId: rootState.paraleloActual.id,
      terminadoPor: {
        nombres: rootState.usuario.nombres,
        apellidos: rootState.usuario.apellidos,
        tipo: rootState.usuario.tipo,
        correo: rootState.usuario.correo
      }
    }
    Vue.http.put(urlApi, data)
      .then((response) => {
        if (response.body.estado) {
          commit('sockets/terminarPregunta', data, { root: true })
          commit('setSesionRespuestas', 'inactivo', { root: true })
          commit('setRespuestas', [])
          commit('setPreguntaProfesor', { texto: '' })
        } else {
          commit('setError', response.body, { root: true })
        }
      }, (err) => {
        commit('setError', err, { root: true })
        console.log(err)
      })
  }
}

// mutations
const mutations = {
  setPreguntaProfesor (state, payload) {
    state.pregunta = payload
  },
  setRespuestas (state, payload) {
    for (let i = payload.length - 1; i >= 0; i--) {
      Vue.set(payload[i], 'show', false)
    }
    payload.sort(function (a, b) {
      a = new Date(a.createdAt)
      b = new Date(b.createdAt)
      return a > b ? -1 : a < b ? 1 : 0
    })
    state.respuestas = payload
    state.respuestasMostrar = payload
  },
  setRespuestasMostrar (state, payload) {
    state.respuestasMostrar = payload
  },
  addRespuesta (state, payload) {
    state.respuestas.unshift(payload)
  },
  setEstadoRespuesta (state, payload) {
    const respuesta = state.respuestas.find((respuesta) => {
      return respuesta._id === payload.id
    })
    respuesta.destacada = payload.estado
  },
  buscar (state, payload) {
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
  filtrar (state, payload) {
    if (payload.filtro.texto === 'Todas') {
      state.respuestasMostrar = state.respuestas
    } else {
      state.respuestasMostrar = state.respuestas.filter((respuesta) => {
        return respuesta.calificacion === payload.filtro.valor
      })
    }
  },
  calificarRespuesta (state, payload) {
    const respuesta = state.respuestas.find((respuesta) => {
      return respuesta.id === payload.id
    })
    if (respuesta && respuesta !== undefined) {
      respuesta.calificacion = payload.calificacion
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
