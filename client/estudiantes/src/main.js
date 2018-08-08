// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import VueSocketio from 'vue-socket.io'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

import App from './App'
import router from './router'
import { store } from './store'

import Navbar from '@/components/Shared/Navbar'

let url
if (process.env.NODE_ENV === 'production') {
  url = '/att'
} else {
  url = 'http://localhost:8000/att'
}

Vue.use(Vuetify)
Vue.use(VueSocketio, url, store)

Vue.component('navbar', Navbar)

Vue.config.productionTip = false

// Filtro para mostrar las fechas
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
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
