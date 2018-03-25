import Vue from 'vue'
import Router from 'vue-router'
import Preguntar from '@/components/Preguntar'
import Responder from '@/components/Responder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Preguntar',
      component: Preguntar
    },
    {
      path: '/preguntar',
      name: 'Preguntar',
      component: Preguntar
    },
    {
      path: '/responder',
      name: 'Responder',
      component: Responder
    }
  ],
  mode: 'history'
})
