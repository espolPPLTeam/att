import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    loggedIn: false,
    preguntas: [],
    preguntasMostrar: []
  },
  mutations: {
    login (state) {
      state.loggedIn = true
    },
    logout (state) {
      state.loggedIn = false
    },
    obtenerPreguntasHoy (state, preguntas) {
      for (let i = preguntas.length - 1; i >= 0; i--) {
        preguntas[i].show = false
      }
      state.preguntas = preguntas
      state.preguntasMostrar = preguntas
    },
    destacarPregunta (state, payload) {
      const pregunta = state.preguntas.find((pregunta) => {
        return pregunta._id === payload.id
      })
      pregunta.destacada = payload.estado
    },
    filtrar (state, payload) {
      console.log(payload)
      if (payload === 'Todas') {
        state.preguntasMostrar = state.preguntas
      } else if (payload === 'Destacadas') {
        state.preguntasMostrar = state.preguntas.filter((pregunta) => {
          return pregunta.destacada === true
        })
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
    }
  },
  actions: {
    login ({commit, state}, payload) {
      commit('login')
    },
    logout ({commit}, payload) {
      commit('logout')
    },
    obtenerPreguntasHoy ({commit}) {
      const paraleloId = '5ab97b42fc38f06297506ae9'
      const urlApi = '/api/att/profesor/preguntasEstudianteHoy/' + paraleloId
      Vue.http.get(urlApi)
        .then((response) => {
          console.log('response:', response)
          if (response.body.estado) {
            commit('obtenerPreguntasHoy', response.body.datos)
          } else {}
        }, (err) => {
          console.log('err:', err)
        })
    },
    destacarPregunta ({commit}, payload) {
      const urlApi = '/api/att/profesor/destacarPregunta'
      const data = {
        preguntaId: payload.id,
        destacadaEstado: payload.estado
      }
      Vue.http.put(urlApi, data)
        .then((response) => {
          if (response.body.estado) {
            commit('destacarPregunta', payload)
          } else {}
        }, (err) => {
          console.log('err', err)
        })
    }
  },
  getters: {
    loggedIn (state) {
      return state.loggedIn
    },
    preguntasMostrar (state) {
      return state.preguntasMostrar
    }
  }
})
