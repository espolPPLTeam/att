<template>
  <v-app id="app">
    <navbar></navbar>
    <v-content>
      <v-container class="px-2 pt-2">
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.commit('sockets/setSocket', this.$socket)
    let token = localStorage.getItem('x-access-token')
    if (token !== null && token !== undefined && token !== '') {
      this.$store.commit('setHeaders', token)
      this.$store.commit('setLoggedIn', true)
      this.$store.dispatch('getLoggedUser')
    } else {
      console.log('No tiene token')
      localStorage.removeItem('x-access-token')
      this.$store.commit('setHeaders', null)
      this.$store.commit('setLoggedIn', false)
      // REDIRECT TO LOGIN
    }
  },
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    },
    preguntaProfesorNueva () {
      return this.$store.getters.preguntaProfesorNueva
    }
  },
  data () {
    return {}
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.text-container{
  word-wrap: break-word !important;
}
.badge .badge__badge{
  margin-right: -20%;
}
.indigo.darken-5 {
  background-color: #001a43 !important;
}
</style>
