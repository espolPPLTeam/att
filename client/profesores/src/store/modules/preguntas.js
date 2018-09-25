import Vue from 'vue'
// initial state
const state = {
  preguntas: [], // Array de preguntas de los estudiantes
  preguntasMostrar: []
}

// getters
const getters = {
  preguntasMostrar (state) {
    return state.preguntasMostrar
  }
}

// actions
const actions = {
  calificarPregunta ({commit}, payload) {
    commit('setError', null, { root: true })
    const urlApi = '/api/att/profesor/calificarPreguntaEstudiante'
    const data = {
      preguntaId: payload.id,
      calificacion: payload.calificacion
    }
    Vue.http.put(urlApi, data)
      .then((response) => {
        if (!response.body.estado) {
          commit('setError', response.body, { root: true })
          commit('calificarPregunta', {id: payload.id, calificacion: payload.calificacionAntigua})
        }
      }, (err) => {
        commit('setError', err, { root: true })
        commit('calificarPregunta', {id: payload.id, calificacion: payload.calificacionAntigua})
        console.log('err', err)
      })
  }
}

// mutations
const mutations = {
  setPreguntas (state, payload) {
    for (let i = payload.length - 1; i >= 0; i--) {
      Vue.set(payload[i], 'show', false)
    }
    payload.sort((a, b) => {
      a = new Date(a.createdAt)
      b = new Date(b.createdAt)
      return a > b ? -1 : a < b ? 1 : 0
    })
    state.preguntas = payload
    state.preguntasMostrar = payload
  },
  addPregunta (state, payload) {
    state.preguntas.unshift(payload)
  },
  setEstadoPregunta (state, payload) {
    const pregunta = state.preguntas.find((pregunta) => {
      return pregunta._id === payload.id
    })
    pregunta.destacada = payload.estado
  },
  calificarPregunta (state, payload) {
    const pregunta = state.preguntas.find((pregunta) => {
      return pregunta.id === payload.id
    })
    if (pregunta && pregunta !== undefined) {
      pregunta.calificacion = payload.calificacion
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
  filtrar (state, payload) {
    if (payload.filtro.texto === 'Todas') {
      state.preguntasMostrar = state.preguntas
    } else {
      state.preguntasMostrar = state.preguntas.filter((pregunta) => {
        return pregunta.calificacion === payload.filtro.valor
      })
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
