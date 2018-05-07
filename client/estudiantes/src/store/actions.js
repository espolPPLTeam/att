import Vue from 'vue'

export default {
  getLoggedUser ({commit}) {
    commit('setError', null)
    // Puede ser el usuario o null si no está loggeado
    Vue.http.get('/api/att/datosUsuario')
      .then((response) => {
        if (response.body.estado) {
          commit('setUsuario', response.body.datos)
          commit('setPreguntas', response.body.datos.misPreguntasHoy)
          if (response.body.datos.preguntaProfesor) {
            commit('setPreguntaProfesor', response.body.datos.preguntaProfesor)
          }
          if (response.body.datos.preguntaProfesor && response.body.datos.preguntaProfesor.respuesta) {
            commit('setRespuesta', {
              texto: response.body.datos.preguntaProfesor.respuesta,
              createdAt: response.body.datos.preguntaProfesor.fechaCreadaRespuesta,
              estado: 'enviada'
            })
          }
          commit('SOCKET_unirseAParalelo')
        } else {
          commit('setLoading', false)
        }
      })
      .catch((err) => {
        console.log(err)
        commit('setError', err)
        commit('setLoading', false)
      })
  },
  login ({commit, dispatch}, payload) {
    commit('setError', null)
    commit('setLoading', true)
    const correo = payload.usuario
    // Autenticación
    Vue.http.post('/api/att/login', {correo})
      .then((response) => {
        if (response.body.estado) {
          dispatch('getLoggedUser')
        } else {
          commit('setError', response.body)
          commit('setLoading', false)
        }
      }, (err) => {
        console.log('err', err)
        commit('setError', err)
        commit('setLoading', false)
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
        if (response.body.estado) {
          commit('preguntaEnviada', payload)
          data.preguntaId = response.body.datos.id
          commit('SOCKET_preguntaEstudiante', data)
        } else {
          commit('preguntaNoEnviada', payload)
          commit('setError', response.body)
        }
      }, (err) => {
        console.log('err:', err)
        commit('setError', err)
        commit('preguntaNoEnviada', payload)
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
