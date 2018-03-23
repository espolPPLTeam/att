// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import App from './App'
import router from './router'

Vue.use(Vuetify)

Vue.config.productionTip = false

// Filtro para mostrar las fechas
Vue.filter('moment', (value) => {
  if (value) {
    return moment(value).format('LTS')
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
