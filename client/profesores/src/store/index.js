import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import preguntas from './modules/preguntas'
import sockets from './modules/sockets'
import respuestas from './modules/respuestas'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  modules: {
    preguntas,
    sockets,
    respuestas
  },
  state: {
    usuario: null,
    paraleloActual: null,
    loggedIn: false,
    error: null,
    filtro: 'Todas',
    pagina: '',
    loading: null,
    preguntaNueva: false,
    respuestaNueva: false,
    sesionRespuestas: 'inactivo',
    // Rstado de historial.js
    preguntasEstudiantesHistorial: []
  },
  mutations,
  actions,
  getters
})
