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
    <v-toolbar app dark>
      <v-toolbar-side-icon @click="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Ask The Teacher</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-tabs centered grow v-if="loggedIn">
        <v-tab :to="{name:'Preguntar'}">Preguntar</v-tab>
        <v-tab :to="{name:'Responder'}">Responder</v-tab>
      </v-tabs>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    }
  },
  watch: {
    loggedIn (value) {
      if (value === true) {
        this.$store.dispatch('obtenerPreguntas')
      }
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
</style>
