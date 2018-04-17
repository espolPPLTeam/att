import Vue from 'vue'

export default {
  getLoggedUser ({commit, dispatch, state}) {
    commit('setError', null)
    Vue.http.get('/api/att/datosUsuario')
      .then((response) => {
        if (response.body.estado) {
          commit('setUsuario', response.body.datos)
          // Por default se obtienen los datos del primer paralelo
          dispatch('getDatosProfesor', {paralelo: state.usuario.paralelos[0]._id, correo: state.usuario.correo})
          commit('SOCKET_unirseAParalelo', state.usuario.paralelos[0]._id)
        }
      }, (err) => {
        commit('setError', err)
        console.log(err)
      })
  },
  /*
    Se obtienen los datos del paralelo del profesor indicado en el payload
    payload = {
      paralelo -> id del paralelo del cual se van a obtener los datos
      correo -> correo del profesor loggeado
    }
  */
  getDatosProfesor ({commit, state}, payload) {
    const urlApi = '/api/att/profesor/perfil/' + payload.paralelo + '/' + payload.correo
    console.log(urlApi)
    Vue.http.get(urlApi)
      .then((response) => {
        commit('setLoading', false)
        if (response.body.estado) {
          commit('setPreguntas', response.body.datos.preguntasEstudiantesHoy)
          if (!isEmpty(response.body.datos.preguntaProfesor)) {
            commit('setPreguntaProfesor', response.body.datos.preguntaProfesor.texto)
            commit('setRespuestas', response.body.datos.preguntaProfesor.respuestas)
            commit('setSesionRespuestas', 'activo')
          } else {
            commit('setSesionRespuestas', 'inactivo')
          }
        }
      }, (err) => {
        console.log(err)
      })
  },
  login ({commit, state, dispatch}, payload) {
    commit('setError', null)
    Vue.http.post('/api/att/login', {correo: payload.usuario})
      .then((response) => {
        if (response.body.estado) {
          dispatch('getLoggedUser')
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
        if (response.body.estado) {
          commit('SOCKET_terminarPregunta', data)
        } else {
          commit('setError', response)
        }
      })
  },
  destacarRespuesta ({commit}, payload) {
    commit('setError', null)
    const urlApi = '/api/att/profesor/destacarRespuesta'
    const data = {
      respuestaId: payload.id,
      destacadaEstado: payload.estado
    }
    Vue.http.put(urlApi, data)
      .then((response) => {
        if (response.body.estado) {
          commit('setEstadoRespuesta', payload)
        } else {
          commit('setError', response.body)
        }
      }, (err) => {
        commit('setError', err)
        console.log('err', err)
      })
  }
}

function isEmpty (obj) {
  return Object.keys(obj).length === 0
}
