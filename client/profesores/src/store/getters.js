export default {
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
  },
  filtro (state) {
    return state.filtro
  },
  pagina (state) {
    return state.pagina
  },
  paralelos (state) {
    if (state.usuario) {
      return state.usuario.paralelos
    } else {
      return null
    }
  },
  paraleloActual (state) {
    if (state.paraleloActual) {
      return state.paraleloActual
    } else {
      return null
    }
  },
  usuario (state) {
    return state.usuario
  },
  loading (state) {
    return state.loading
  }
}
