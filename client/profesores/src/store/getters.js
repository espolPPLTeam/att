export default {
  usuario (state) {
    return state.usuario
  },
  paraleloActual (state) {
    return state.paraleloActual
  },
  loggedIn (state) {
    return state.loggedIn
  },
  error (state) {
    return state.error
  },
  filtro (state) {
    return state.filtro
  },
  pagina (state) {
    return state.pagina
  },
  loading (state) {
    return state.loading
  },
  preguntaNueva (state) {
    return state.preguntaNueva
  },
  respuestaNueva (state) {
    return state.respuestaNueva
  },
  sesionRespuestas (state) {
    return state.sesionRespuestas
  },
  paralelos (state) {
    if (state.usuario) {
      return state.usuario.paralelos
    } else {
      return null
    }
  },
  // Estado de historial.js
  preguntasEstudiantesHistorial (state) {
    return state.preguntasEstudiantesHistorial
  }
}
