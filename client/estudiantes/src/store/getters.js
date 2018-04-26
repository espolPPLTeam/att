export default {
  preguntas (state) {
    return state.preguntas.sort((preguntaA, preguntaB) => {
      return preguntaA.createdAt > preguntaB.createdAt
    })
  },
  estudiante (state) {
    return state.usuario
  },
  loggedIn (state) {
    return state.loggedIn
  },
  error (state) {
    return state.error
  },
  preguntaProfesor (state) {
    return state.preguntaProfesor
  },
  respuesta (state) {
    return state.respuesta
  },
  loading (state) {
    return state.loading
  },
  preguntaProfesorNueva (state) {
    return state.preguntaProfesorNueva
  },
  pagina (state) {
    return state.pagina
  }
}
