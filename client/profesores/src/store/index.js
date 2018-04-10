import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import router from '../router'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    io: null,
    loggedIn: false,
    preguntas: [], // Preguntas de los estudiantes
    preguntasMostrar: [], // Preguntas filtradas
    sesionRespuestas: 'inactivo',
    pregunta: '', // Pregunta que el profesor envía a los estudiantes
    respuestas: [],
    respuestasMostrar: [],
    usuario: null,
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
    SOCKET_unirseAParalelo (state) {
      state.io.emit('unirseAParalelo', { paraleloId: state.usuario.paralelos[0]._id })
    },
    SOCKET_preguntaProfesor (state, payload) {
      state.io.emit('preguntaProfesor', payload)
      state.pregunta = payload
    },
    SOCKET_terminarPregunta (state, payload) {
      state.io.emit('terminarPregunta', payload)
    },
    SOCKET_UNIDO_PARALELO (state) {
      state.loggedIn = true
      router.push('/preguntas')
    },
    SOCKET_PREGUNTA_ESTUDIANTE (state, data) {
      console.log('pregunta:', data)
      const pregunta = {
        _id: data[0].preguntaId,
        texto: data[0].texto,
        destacada: false,
        createdAt: data[0].createdAt,
        creador: data[0].creador,
        paralelo: data[0].paraleloId,
        show: false
      }
      state.preguntas.push(pregunta)
      state.preguntasMostrar = state.preguntas
    },
    SOCKET_RESPUESTA_ESTUDIANTE (state, data) {
      data[0].show = false
      state.respuestas.push(data[0])
      state.respuestasMostrar = state.respuestas
    },
    SOCKET_TERMINAR_PREGUNTA (state, payload) {
      state.respuestas = []
      state.respuestasMostrar = []
      state.pregunta = ''
      state.sesionRespuestas = 'inactivo'
    },
    logout (state) {
      state.loggedIn = false
      state.usuario = null
    },
    setUsuario (state, payload) {
      state.usuario = payload
    },
    obtenerPreguntasHoy (state, preguntas) {
      for (let i = preguntas.length - 1; i >= 0; i--) {
        preguntas[i].show = false
      }
      state.preguntas = preguntas
      state.preguntasMostrar = preguntas
    },
    setEstadoPregunta (state, payload) {
      const pregunta = state.preguntas.find((pregunta) => {
        return pregunta._id === payload.id
      })
      pregunta.destacada = payload.estado
    },
    filtrar (state, payload) {
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
    },
    filtrarRespuestas (state, payload) {
      if (payload === 'Todas') {
        state.respuestasMostrar = state.respuestas
      } else if (payload === 'Marcadas') {
        state.respuestasMostrar = state.respuestas.filter((respuesta) => {
          return respuesta.marcada === true
        })
      }
    },
    buscarRespuestas (state, payload) {
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
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setSesionRespuestas (state, payload) {
      state.sesionRespuestas = payload
    }
  },
  actions: {
    getLoggedUser ({commit}) {
      commit('setError', null)
      Vue.http.get('/api/att/datosUsuario')
        .then((response) => {
          if (response.body.estado) {
            commit('setUsuario', response.body.datos)
            commit('SOCKET_unirseAParalelo')
          } else {
            commit('setError', response)
          }
        }, (err) => {
          commit('setError', err)
          console.log(err)
        })
    },
    login ({commit, state}, payload) {
      commit('setError', null)
      const correo = payload.usuario
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
          console.log('err:', err)
          commit('setError', err)
        })
    },
    logout ({commit}, payload) {
      Vue.http.get('/api/att/logout')
        .then((response) => {
          if (response.body.estado) {
            commit('logout')
            commit('disconnectSocket')
          } else {
            console.log('ERROR LOGOUT')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    obtenerPreguntasHoy ({commit, state}) {
      const urlApi = '/api/att/profesor/preguntasEstudianteHoy/' + state.usuario.paralelos[0]._id
      Vue.http.get(urlApi)
        .then((response) => {
          if (response.body.estado) {
            commit('obtenerPreguntasHoy', response.body.datos)
          } else {
            commit('setError', response.body)
          }
        }, (err) => {
          commit('setError', err)
          console.log('err:', err)
        })
    },
    destacarPregunta ({commit}, payload) {
      commit('setError', null)
      const urlApi = '/api/att/profesor/destacarPregunta'
      const data = {
        preguntaId: payload.id,
        destacadaEstado: payload.estado
      }
      Vue.http.put(urlApi, data)
        .then((response) => {
          if (response.body.estado) {
            commit('setEstadoPregunta', payload)
          } else {
            commit('setError', response.body)
          }
        }, (err) => {
          commit('setError', err)
          console.log('err', err)
        })
    },
    enviarPregunta ({commit, state}, payload) {
      commit('setError', null)
      const data = {
        paraleloId: state.usuario.paralelos[0]._id,
        preguntaId: '',
        texto: payload,
        creador: state.usuario
      }
      Vue.http.post('/api/att/profesor/preguntar', data)
        .then((response) => {
          data.preguntaId = response.body.datos._id
          commit('SOCKET_preguntaProfesor', data)
          commit('setSesionRespuestas', 'activo')
        }, (err) => {
          console.log(err)
          commit('setError', err)
        })
    },
    terminarSesionRespuestas ({commit, state}) {
      commit('setError', null)
      const urlApi = '/api/att/profesor/terminarPregunta'
      const data = {
        preguntaId: state.pregunta.preguntaId,
        paraleloId: state.usuario.paralelos[0]._id,
        terminadoPor: {
          nombres: state.usuario.nombres,
          apellidos: state.usuario.apellidos,
          tipo: state.usuario.tipo,
          correo: state.usuario.correo
        }
      }
      Vue.http.put(urlApi, data)
        .then((response) => {
          console.log(response)
          if (response.body.estado) {
            commit('SOCKET_terminarPregunta', data)
          } else {
            commit('setError', response)
          }
        })
    }
  },
  getters: {
    loggedIn (state) {
      return state.loggedIn
    },
    preguntasMostrar (state) {
      return state.preguntasMostrar
    },
    sesionRespuestas (state) {
      return state.sesionRespuestas
    },
    pregunta (state) {
      return state.pregunta
    },
    respuestasMostrar (state) {
      return state.respuestasMostrar
    },
    error (state) {
      return state.error
    }
  }
})
