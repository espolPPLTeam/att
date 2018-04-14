<template>
  <v-app id="app">
    <!-- Sidenav mobile -->
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
    <!-- Toolbar desktop -->
    <v-toolbar app dark class="hidden-xs-only">
      <v-toolbar-title class="white--text">Ask The Teacher</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat
          v-for="item in menuItems"
          router :to="item.link"
          :key="item.title"
          v-if="loggedIn">
          {{ item.title }}
        </v-btn>
        <v-btn v-if="loggedIn" @click="logout">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Toolbar mobile -->
    <v-toolbar app dark scroll-off-screen class="hidden-sm-and-up">
      <v-toolbar-side-icon
        @click.native="sideNav = !sideNav"
        class="hidden-sm-and-up"
        v-if="loggedIn">
      </v-toolbar-side-icon>
      <v-toolbar-title class="white--text" style="font-size:initial;" v-if="loggedIn">
        <h3 class="titulo-toolbar">{{ pagina }}</h3>
        <span class="subtitulo-toolbar">{{ filtro }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="mr-2" v-if="loggedIn">
        <v-btn icon class="mr-2">
          <v-icon>search</v-icon>
        </v-btn>
        <v-menu dark>
          <v-btn icon slot="activator">
            <v-icon>sort</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="filtrar('Todas')">
              <v-list-tile-title>Todas</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="filtrar('Destacadas')">
              <v-list-tile-title>Destacadas</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content class="pt-0">
      <router-view></router-view>
    </v-content>
    <!-- Footer -->
    <v-footer id="footer" app color="white" class="hidden-sm-and-up" v-if="loggedIn">
      <v-bottom-nav absolute :value="true" :active.sync="e3" color="white">
        <v-btn flat color="teal" router :to="'/preguntas'">
          <span class="mt-1">Preguntas</span>
          <v-icon>fas fa-question</v-icon>
        </v-btn>
        <v-btn flat color="teal" router :to="'/respuestas'">
          <span>Respuestas</span>
          <v-icon>question_answer</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-footer>
  </v-app>
</template>

<script>
export default {
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
    filtro () {
      return this.$store.getters.filtro
    },
    pagina () {
      return this.$store.getters.pagina
    }
  },
  data () {
    return {
      e3: 1,
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
    },
    filtrar (filtro) {
      this.$store.commit('filtrar', {filtro: filtro, pagina: this.pagina})
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
.text-container{
  word-wrap: break-word !important;
}
.caption{
  color: grey;
}
p{
  text-align: justify;
}
button:focus{
  background-color: black !important;
}
.titulo-toolbar{
  font-size: large;
}
.subtitulo-toolbar{
  font-size: smaller;
  color: #cccdce;
}
</style>
