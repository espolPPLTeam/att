import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import router from '../router'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    io: {},
    loggedIn: false,
    usuario: {
      _id: '1',
      correo: 'edanmora@espol.edu.ec',
      matricula: '201304614',
      nombres: 'Edison',
      apellidos: 'Mora'
    },
    paraleloId: '5ab97b42fc38f06297506ae9',
    preguntas: []
  },
  mutations: {
    setSocket (state, socket) {
      state.io = socket
    },
    SOCKET_PREGUNTA (state, data) {
      state.io.emit('preguntaEstudiante', data)
    },
    SOCKET_UNIRSE_PARALELO (state) {
      state.io.emit('unirseAParalelo', { paraleloId: state.paraleloId })
    },
    SOCKET_UNIDO_PARALELO (state) {
      state.loggedIn = true
      router.push('/preguntar')
    },
    SOCKET_DISCONNECT (state) {
      state.loggedIn = false
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
    },
    obtenerPreguntas (state, preguntas) {
      for (let i = 0; i < preguntas.length; i++) {
        preguntas[i].estado = 'enviada'
      }
      state.preguntas = preguntas
    }
  },
  actions: {
    login ({commit}, payload) {
      const correo = payload.usuario
      // Autenticación
      Vue.http.post('/api/att/login', {correo})
        .then((response) => {
          if (response.body.estado) {
            commit('SOCKET_UNIRSE_PARALELO')
          } else {
            return false
          }
        }, (err) => {
          console.log('err', err)
        })
    },
    logout ({commit}) {
      Vue.http.get('/api/att/logout')
        .then((response) => {
          commit('SOCKET_DISCONNECT')
          router.push('/')
        }, (err) => {
          console.log('err:', err)
        })
    },
    anadirPregunta ({commit, state}, payload) {
      // Primero se añade la pregunta al array. Con estado 'enviando'
      commit('anadirPregunta', payload)
      // Se envía la pregunta a la base de datos
      const data = {
        texto: payload.texto,
        createdAt: payload.createdAt,
        paraleloId: state.paraleloId,
        creador: state.usuario
      }
      Vue.http.post('/api/att/estudiante/preguntar', data)
        .then((response) => {
          commit('preguntaEnviada', payload)
          commit('SOCKET_PREGUNTA', data)
          // Luego se debe enviar por sockets al profesor
        }, (err) => {
          console.log('err:', err)
          commit('preguntaNoEnviada', payload)
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
      return state.usuario
    },
    loggedIn (state) {
      return state.loggedIn
    }
  }
})
