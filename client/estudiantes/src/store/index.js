import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import preguntasEstudiante from './modules/preguntasEstudiante'
import preguntaProfesor from './modules/preguntaProfesor'
import sockets from './modules/sockets'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  modules: {
    preguntasEstudiante,
    preguntaProfesor,
    sockets
  },
  state: {
    loggedIn: false,
    usuario: null,
    paraleloActual: null,
    preguntaProfesorNueva: false,
    error: null,
    loading: null,
    pagina: ''
  },
  mutations,
  actions,
  getters
})
