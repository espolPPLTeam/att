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
    preguntas: [], // Preguntas de los estudiantes
    preguntasMostrar: [], // Preguntas filtradas
    sesionRespuestas: 'inactivo',
    pregunta: {
      texto: ''
    }, // Pregunta que el profesor envía a los estudiantes
    respuestas: [],
    respuestasMostrar: [],
    usuario: null,
    paraleloActual: null,
    // Variables de control
    loggedIn: false,
    error: null,
    filtro: 'Todas',
    pagina: '',
    loading: null,
    preguntaNueva: false,
    respuestaNueva: false
  },
  mutations,
  actions,
  getters
})
