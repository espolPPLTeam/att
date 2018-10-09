import Vue from 'vue'

export default {
  getLoggedUser ({commit}) {
    commit('setError', null)
    // Puede ser el usuario o null si no está loggeado
    Vue.http.get('/api/login/session/att')
      .then((response) => {
        commit('setUsuario', response.body.datos)
        const paraleloActual = response.body.datos.paralelos[0]
        commit('setParaleloActual', paraleloActual)
        commit('preguntasEstudiante/setPreguntas', response.body.datos.preguntas)
        if (paraleloActual.preguntaActual) {
          commit('preguntaProfesor/setPreguntaProfesor', paraleloActual.preguntaActual)
          if (paraleloActual.preguntaActual.respuestas.length > 0) {
            commit('preguntaProfesor/setRespuesta', paraleloActual.preguntaActual.respuestas[0])
          }
        }
        //commit('sockets/SOCKET_unirseAParalelo', paraleloActual._id)
        console.log(response)
      })
      .catch((err) => {
        console.log(err)
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
  }
}
