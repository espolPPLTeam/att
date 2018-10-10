import Vue from 'vue'

export default {
  setHeaders (state, token) {
    Vue.http.headers.common['x-access-token'] = token
  },
  setLoggedIn (state, payload) {
    state.loggedIn = payload
  },
  setUsuario (state, payload) {
    state.usuario = {
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      email: payload.email,
      matricula: payload.matricula,
      paralelos: payload.paralelos,
      _id: payload._id
    }
  },
  setParaleloActual (state, payload) {
    state.paraleloActual = payload
  },
  setPreguntaProfesorNueva (state, payload) {
    state.preguntaProfesorNueva = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setPagina (state, payload) {
    state.pagina = payload
  },
  logout (state) {
    state.loggedIn = false
    state.usuario = null
    state.preguntaProfesor = null
    state.preguntas = []
    state.respuesta = null
  }
}
