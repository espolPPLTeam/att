<template>
  <v-app id="app">
    <v-navigation-drawer temporary v-model="sideNav" app>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark>
      <v-toolbar-side-icon
        @click.native="sideNav = !sideNav"
        class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Ask The Teacher</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat
          v-for="item in menuItems"
          router :to="item.link"
          :key="item.title"
          v-if="loggedIn">{{ item.title }}</v-btn>
          <v-btn v-if="loggedIn" @click="logout">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  watch: {
    loggedIn (value) {
      if (value === true) {
        this.$store.dispatch('obtenerPreguntasHoy')
      }
    }
  },
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    }
  },
  data () {
    return {
      sideNav: false,
      menuItems: [
        {
          title: 'Preguntas',
          link: '/preguntas'
        },
        {
          title: 'Respuestas',
          link: '/respuestas'
        }
      ]
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
  margin-top: 60px;
}
</style>
