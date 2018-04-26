import Vue from 'vue'

export default {
  getLoggedUser ({commit, dispatch, state}) {
    commit('setError', null)
    Vue.http.get('/api/att/datosUsuario')
      .then((response) => {
        if (response.body.estado) {
          commit('setUsuario', response.body.datos)
          // Por default se obtienen los datos del primer paralelo
          const paraleloActual = response.body.datos.paralelos[0]
          commit('setParaleloActual', paraleloActual)
          dispatch('getDatosProfesor', {paralelo: paraleloActual.id, correo: state.usuario.correo})
          commit('SOCKET_unirseAParalelo', paraleloActual.id)
        } else {
          commit('setLoading', false)
        }
      }, (err) => {
        commit('setError', err)
        commit('setLoading', false)
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
    commit('setError', null)
    const urlApi = '/api/att/profesor/perfil/' + payload.paralelo + '/' + payload.correo
    Vue.http.get(urlApi)
      .then((response) => {
        commit('setLoading', false)
        if (response.body.estado) {
          commit('setPreguntas', response.body.datos.preguntasEstudiantesHoy)
          if (hayPreguntaActual(response.body.datos.preguntaProfesor)) {
            commit('setPreguntaProfesor', response.body.datos.preguntaProfesor)
            commit('setRespuestas', response.body.datos.preguntaProfesor.respuestas)
            commit('setSesionRespuestas', 'activo')
          } else {
            commit('setSesionRespuestas', 'inactivo')
          }
        } else {
          commit('setError', response.body)
        }
      }, (err) => {
        commit('setError', err)
        commit('setLoading', false)
        console.log(err)
      })
  },
  login ({commit, state, dispatch}, payload) {
    commit('setError', null)
    commit('setLoading', true)
    Vue.http.post('/api/att/login', {correo: payload.usuario})
      .then((response) => {
        if (response.body.estado) {
          dispatch('getLoggedUser')
        } else {
          commit('setError', response.body)
          commit('setLoading', false)
        }
      }, (err) => {
        commit('setLoading', false)
        console.log('err:', err)
        commit('setError', err)
      })
  },
  logout ({commit}, payload) {
    commit('setLoading', true)
    Vue.http.get('/api/att/logout')
      .then((response) => {
        commit('setLoading', false)
        if (response.body.estado) {
          commit('logout')
          commit('disconnectSocket')
        } else {
          console.log('ERROR LOGOUT')
          commit('setError', response.body)
        }
      })
      .catch((err) => {
        commit('setLoading', false)
        commit('setError', err)
        console.log(err)
      })
  },
  destacarPregunta ({commit}, payload) {
    commit('setError', null)
    commit('setEstadoPregunta', payload)
    const urlApi = '/api/att/profesor/destacarPregunta'
    const data = {
      preguntaId: payload.id,
      destacadaEstado: payload.estado
    }
    Vue.http.put(urlApi, data)
      .then((response) => {
        payload.estado = !payload.estado
        if (!response.body.estado) {
          commit('setError', response.body)
          commit('setEstadoPregunta', payload)
        }
      }, (err) => {
        payload.estado = !payload.estado
        commit('setError', err)
        console.log('err', err)
        commit('setEstadoPregunta', payload)
      })
  },
  enviarPregunta ({commit, state}, payload) {
    commit('setError', null)
    commit('setLoading', true)
    const data = {
      paraleloId: state.paraleloActual.id,
      creador: state.usuario,
      texto: payload
    }
    Vue.http.post('/api/att/profesor/preguntar', data)
      .then((response) => {
        commit('setLoading', false)
        if (response.body.estado) {
          data.id = response.body.datos.id
          commit('SOCKET_preguntaProfesor', data)
          commit('setPreguntaProfesor', data)
          commit('setSesionRespuestas', 'activo')
        } else {
          commit('setError', response.body)
        }
      }, (err) => {
        commit('setLoading', false)
        commit('setError', err)
        console.log(err)
      })
  },
  terminarSesionRespuestas ({commit, state}) {
    commit('setError', null)
    const urlApi = '/api/att/profesor/terminarPregunta'
    const data = {
      preguntaId: state.pregunta.id,
      paraleloId: state.paraleloActual.id,
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
          commit('setError', response.body)
        }
      }, (err) => {
        commit('setError', err)
        console.log(err)
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

function hayPreguntaActual (obj) {
  return obj.hasOwnProperty('id')
}
