// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import App from './App'
import router from './router'
import { store } from './store'

import Star from './components/Shared/Stars'
import Pregunta from './components/Shared/Pregunta'
import Respuesta from './components/Shared/Respuesta'
import Navbar from './components/Shared/Navbar'

let url
if (process.env.NODE_ENV === 'production') {
  url = '/att'
} else {
  url = 'http://localhost:8000/att'
}

Vue.use(Vuetify)
Vue.use(VueSocketio, io(url), { store })

Vue.config.productionTip = false

Vue.filter('moment', (value) => {
  if (value) {
    return moment(value).format('LTS')
  }
})
Vue.filter('timeFromDate', (value) => {
  if (value) {
    return moment(value).locale('es').fromNow()
  }
})

// COMPONENTS
Vue.component('star', Star)
Vue.component('card-pregunta', Pregunta)
Vue.component('card-respuesta', Respuesta)
Vue.component('navbar', Navbar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  sockets: {
    CAMBIO_PARALELO (data) {
      const correo = this.$store.getters.usuario.correo
      const paralelo = data
      this.$store.dispatch('getDatosProfesor', {paralelo, correo})
    }
  },
  components: { App },
  template: '<App/>'
})
