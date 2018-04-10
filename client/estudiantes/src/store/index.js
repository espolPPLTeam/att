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
    usuario: null,
    preguntas: [],
    preguntaProfesor: null,
    respuesta: null,
    error: null
  },
  mutations: {
    setSocket (state, socket) {
      state.io = socket
    },
    disconnectSocket (state) {
      state.io.emit('disconnect')
      state.io = null
      router.push('/')
    },
    SOCKET_preguntaEstudiante (state, data) {
      state.io.emit('preguntaEstudiante', data)
    },
    SOCKET_unirseAParalelo (state) {
      state.io.emit('unirseAParalelo', { paraleloId: state.usuario.paraleloId })
    },
    SOCKET_responder (state, payload) {
      state.io.emit('responder', payload)
    },
    SOCKET_UNIDO_PARALELO (state) {
      state.loggedIn = true
      router.push('/preguntar')
    },
    SOCKET_PREGUNTA_PROFESOR (state, payload) {
      state.preguntaProfesor = payload[0]
    },
    SOCKET_TERMINAR_PREGUNTA (state, payload) {
      state.preguntaProfesor = null
      state.respuesta = null
    },
    logout (state) {
      state.loggedIn = false
      state.usuario = null
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
    },
    anadirRespuesta (state, payload) {
      payload.estado = 'enviando'
      state.respuesta = payload
    },
    setEstadoRespuesta (state, payload) {
      state.respuesta.estado = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setUsuario (state, payload) {
      state.usuario = payload
    }
  },
  actions: {
    getLoggedUser ({commit}) {
      commit('setError', null)
      // Puede ser el usuario o null si no está loggeado
      Vue.http.get('/api/att/datosUsuario')
        .then((response) => {
          if (response.body.estado) {
            commit('setUsuario', response.body.datos)
            commit('SOCKET_unirseAParalelo')
          }
        })
        .catch((err) => {
          commit('setError', err)
          console.log(err)
        })
    },
    login ({commit}, payload) {
      commit('setError', null)
      const correo = payload.usuario
      // Autenticación
      Vue.http.post('/api/att/login', {correo})
        .then((response) => {
          console.log(response)
          if (response.body.estado) {
            commit('setUsuario', response.body.datos)
            commit('SOCKET_unirseAParalelo')
          } else {
            commit('setError', response.body)
          }
        }, (err) => {
          console.log('err', err)
          commit('setError', err)
        })
    },
    logout ({commit}) {
      Vue.http.get('/api/att/logout')
        .then((response) => {
          if (response.body.estado) {
            commit('logout')
            commit('disconnectSocket')
          } else {
            console.log('ERROR LOGOUT')
          }
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
        paraleloId: state.usuario.paraleloId,
        creador: state.usuario
      }
      Vue.http.post('/api/att/estudiante/preguntar', data)
        .then((response) => {
          console.log(response)
          commit('preguntaEnviada', payload)
          commit('SOCKET_preguntaEstudiante', data)
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
    },
    responder ({commit, state}, payload) {
      commit('setError', null)
      const data = {
        paraleloId: state.usuario.paraleloId,
        preguntaId: state.preguntaProfesor.preguntaId,
        texto: payload,
        creador: {
          correo: state.usuario.correo,
          matricula: state.usuario.matricula,
          nombres: state.usuario.nombres,
          apellidos: state.usuario.apellidos,
          _id: state.usuario._id
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
            commit('setError', response)
            commit('setEstadoRespuesta', 'no enviada')
          }
        }, (err) => {
          console.log(err)
          commit('setError', err)
          commit('setEstadoRespuesta', 'no enviada')
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
    },
    error (state) {
      return state.error
    },
    preguntaProfesor (state) {
      return state.preguntaProfesor
    },
    respuesta (state) {
      return state.respuesta
    }
  }
})
