<template>
  <v-app id="app">
    <v-navigation-drawer temporary v-model="sideNav" app>
      <v-list>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark class="hidden-xs-only">
      <v-toolbar-side-icon @click="sideNav = !sideNav" v-if="loggedIn"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Ask The Teacher</v-toolbar-title>
    </v-toolbar>
    <v-toolbar app dark scroll-off-screen class="hidden-sm-and-up">
      <v-toolbar-side-icon @click="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">ATT</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-tabs centered grow v-if="loggedIn">
        <v-tab :to="{name:'Preguntar'}">
          Preguntar
        </v-tab>
        <v-tab :to="{name:'Responder'}">
          <v-badge v-model="preguntaProfesorNueva" color="red darken-1" overlap>
            <v-icon color="white" slot="badge">!</v-icon>
            Responder
          </v-badge>
        </v-tab>
      </v-tabs>
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
    this.$store.commit('setSocket', this.$socket)
  },
  mounted () {
    this.$store.dispatch('getLoggedUser')
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
    return {
      sideNav: false
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
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
</style>
