import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Preguntar from '@/components/Preguntar'
import Responder from '@/components/Responder'

import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/preguntar',
      name: 'Preguntar',
      component: Preguntar,
      beforeEnter: AuthGuard
    },
    {
      path: '/responder',
      name: 'Responder',
      component: Responder,
      beforeEnter: AuthGuard
    }
  ]
  //  mode: 'history'
})
