import Vue from 'vue'

export default {
  setUsuario (state, payload) {
    state.usuario = payload
  },
  setParaleloActual (state, payload) {
    state.paraleloActual = payload
  },
  setLoggedIn (state, payload) {
    state.loggedIn = payload
  },
  // SOCKETS ENVIAOS
  logout (state) {
    state.loggedIn = false
    state.usuario = null
  },
  setError (state, payload) {
    state.error = payload
  },
  setFiltro (state, payload) {
    state.filtro = payload
  },
  setPagina (state, payload) {
    state.pagina = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setPreguntaNueva (state, payload) {
    state.preguntaNueva = payload
  },
  setRespuestaNueva (state, payload) {
    state.respuestaNueva = payload
  },
  setSesionRespuestas (state, payload) {
    state.sesionRespuestas = payload
  },
  // Estado historial.js
  setPreguntasEstudiantesHistorial (state, payload) {
    for (let i = payload.length - 1; i >= 0; i--) {
      Vue.set(payload[i], 'show', false)
    }
    payload.sort(function (a, b) {
      a = new Date(a.createdAt)
      b = new Date(b.createdAt)
      return a > b ? -1 : a < b ? 1 : 0
    })
    state.preguntasEstudiantesHistorial = payload
  }
}
