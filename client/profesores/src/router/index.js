import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Preguntas from '@/components/Preguntas'
import Respuestas from '@/components/Respuestas'
import Historial from '@/components/Historial'

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
      path: '/preguntas',
      name: 'Preguntas',
      component: Preguntas,
      beforeEnter: AuthGuard
    },
    {
      path: '/respuestas',
      name: 'Respuestas',
      component: Respuestas,
      beforeEnter: AuthGuard
    },
    {
      path: '/historial',
      name: 'Historial',
      component: Historial,
      beforeEnter: AuthGuard
    }
  ]
  //  mode: 'history'
})
