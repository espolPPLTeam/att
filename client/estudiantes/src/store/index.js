import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    usuario: {
      _id: '1',
      correo: 'edanmora@espol.edu.ec',
      matricula: '201304614',
      nombres: 'Edison',
      apellidos: 'Mora'
    },
    preguntas: []
  },
  mutations: {
    anadirPregunta (state, payload) {
      state.preguntas.push(payload)
    },
    obtenerPreguntas (state, preguntas) {
      state.preguntas = preguntas
    }
  },
  actions: {
    anadirPregunta ({commit, state}, payload) {
      const pregunta = {
        texto: payload.texto,
        createdAt: payload.createdAt
      }
      const data = {
        texto: payload.texto,
        paraleloId: '5ab97b42fc38f06297506ae9',
        creador: state.usuario
      }
      Vue.http.post('/api/att/estudiante/preguntar', data)
        .then((response) => {
          commit('anadirPregunta', pregunta)
        }, (err) => {
          console.log('err:', err)
        })
    },
    obtenerPreguntas ({commit, state}) {
      const urlApi = '/api/att/estudiante/misPreguntasHoy/' + state.usuario.correo
      Vue.http.get(urlApi)
        .then((response) => {
          commit('obtenerPreguntas', response.body.datos)
        }, (err) => {
          console.log('err:', err)
        })
    }
  },
  getters: {
    preguntas (state) {
      return state.preguntas.sort((preguntaA, preguntaB) => {
        return preguntaA.createdAt > preguntaB.createdAt
      })
    },
    estudiante (state) {
      return state.estudiante
    }
  }
})
