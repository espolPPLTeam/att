import Vue from 'vue'

export default {
  getLoggedUser ({commit, dispatch, state}) {
    commit('setError', null)
    Vue.http.get('/api/att/datosUsuario')
      .then((response) => {
        commit('setLoading', false)
        if (response.body.estado) {
          commit('setUsuario', response.body.datos)
          // Por default se obtienen los datos del primer paralelo
          const paraleloActual = response.body.datos.paralelos[0]
          commit('setParaleloActual', paraleloActual)
          commit('sockets/unirAParalelo', paraleloActual.id)
          dispatch('getDatosProfesor', {paralelo: paraleloActual.id, correo: state.usuario.correo})
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
          commit('preguntas/setPreguntas', response.body.datos.preguntasEstudiantesHoy)
          if (hayPreguntaActual(response.body.datos.preguntaProfesor)) {
            commit('respuestas/setPreguntaProfesor', response.body.datos.preguntaProfesor)
            commit('respuestas/setRespuestas', response.body.datos.preguntaProfesor.respuestas)
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
          commit('sockets/disconnectSocket')
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
  getPreguntasEstudiantesDia ({commit}, payload) {
    commit('setError', null)
    commit('setLoading', true)
    const urlApi = '/api/att/profesor/preguntasEstudiantes/' + payload.dia
    Vue.http.get(urlApi)
      .then((response) => {
        console.log(response)
        commit('setLoading', false)
        if (response.body.estado) {
          commit('setPreguntasEstudiantesHistorial', response.body.datos)
        } else {
          commit('setError', response.body)
        }
      }, (err) => {
        commit('setError', err)
        commit('setLoading', false)
      })
  },
  filtrar ({commit}, payload) {
    commit('setFiltro', payload.filtro.texto)
    if (payload.pagina === 'Preguntas') {
      commit('preguntas/filtrar', payload)
    } else if (payload.pagina === 'Respuestas') {
      commit('respuestas/filtrar', payload)
    }
  }
}

function hayPreguntaActual (obj) {
  return obj.hasOwnProperty('id')
}
