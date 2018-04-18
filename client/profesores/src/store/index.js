import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    io: null,
    loggedIn: false,
    preguntas: [], // Preguntas de los estudiantes
    preguntasMostrar: [], // Preguntas filtradas
    sesionRespuestas: 'inactivo',
    pregunta: {
      texto: ''
    }, // Pregunta que el profesor envía a los estudiantes
    respuestas: [],
    respuestasMostrar: [],
    usuario: null,
    error: null,
    filtro: 'Todas',
    pagina: '',
    paraleloActual: null,
    loading: null
  },
  mutations,
  actions,
  getters
})
