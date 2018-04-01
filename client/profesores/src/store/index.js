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
    preguntas: [], // Preguntas de los estudiantes
    preguntasMostrar: [], // Preguntas filtradas
    paraleloId: '5ab97b42fc38f06297506ae9',
    sesionRespuestas: 'inactivo',
    pregunta: '', // Pregunta que el profesor envía a los estudiantes
    respuestas: [
      {
        texto: 'Esta es mi respuesta',
        creador: {
          _id: '1',
          correo: 'edanmora@espol.edu.ec',
          matricula: '201304614',
          nombres: 'Edison',
          apellidos: 'Mora'
        },
        show: false,
        createdAt: new Date(),
        marcada: false
      }
    ],
    respuestasMostrar: [
      {
        texto: 'Esta es mi respuesta',
        creador: {
          _id: '1',
          correo: 'edanmora@espol.edu.ec',
          matricula: '201304614',
          nombres: 'Edison',
          apellidos: 'Mora'
        },
        show: false,
        createdAt: new Date(),
        marcada: false
      }
    ]
  },
  mutations: {
    setSocket (state, socket) {
      state.io = socket
      state.loggedIn = true
    },
    SOCKET_UNIRSE_PARALELO (state) {
      state.io.emit('unirseAParalelo', { paraleloId: state.paraleloId })
    },
    SOCKET_UNIDO_PARALELO (state) {
      state.loggedIn = true
      router.push('/preguntas')
    },
    SOCKET_PREGUNTA_ESTUDIANTE (state, data) {
      console.log(data)
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
    },
    SOCKET_PREGUNTA_PROFESOR (state, pregunta) {
      state.io.emit('', pregunta)
      state.pregunta = pregunta
    },
    SOCKET_RESPUESTA_ESTUDIANTE (state, data) {
      state.respuestas.push(data)
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
    iniciarSesionRespuestas (state) {
      state.sesionRespuestas = 'activo'
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
    }
  },
  actions: {
    login ({commit, state}, payload) {
      const correo = payload.usuario
      Vue.http.post('/api/att/login', {correo})
        .then((response) => {
          console.log(response)
          if (response.body.estado) {
            commit('SOCKET_UNIRSE_PARALELO')
          } else {
            return false
          }
        }, (err) => {
          console.log('err:', err)
        })
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
    },
    sesionRespuestas (state) {
      return state.sesionRespuestas
    },
    pregunta (state) {
      return state.pregunta
    },
    respuestasMostrar (state) {
      return state.respuestasMostrar
    }
  }
})
