<template>
  <main class="indigo darken-5">
    <v-navigation-drawer temporary v-model="sideNav" app color="indigo darken-5">
      <v-list>
        <!-- Usuario -->
        <v-list-tile avatar v-if="estudiante">
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ estudiante.nombres }} {{ estudiante.apellidos }}
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="mt-1"></v-divider>
        <v-list-tile v-for="paralelo in estudiante.paralelos" :key="paralelo._id" @click="cambiarParalelo(paralelo._id)">
          <v-list-tile-action>
            <v-icon></v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            {{ paralelo.nombreMateria }} - P{{ paralelo.nombre }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="loggedIn" router :to="{name:'Preguntar'}">
          <v-list-tile-action>
            <v-icon>help</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Preguntar</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="loggedIn" router :to="{name:'Responder'}">
          <v-list-tile-action>
            <v-icon>question_answer</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Responder</v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile v-if="loggedIn" @click="ppl">
          <v-list-tile-content>PPL</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark class="hidden-xs-only" color="indigo darken-5">
      <v-toolbar-side-icon @click="sideNav = !sideNav" v-if="loggedIn"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Ask The Teacher - {{ pagina }}</v-toolbar-title>
    </v-toolbar>
    <v-toolbar app dark scroll-off-screen class="hidden-sm-and-up" color="indigo darken-5">
      <v-toolbar-side-icon @click="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">ATT - {{ pagina }}</v-toolbar-title>
    </v-toolbar>
  </main>
</template>
<script>
export default {
  data () {
    return {
      sideNav: false
    }
  },
  computed: {
    estudiante () {
      return this.$store.getters.estudiante
    },
    loggedIn () {
      return this.$store.getters.loggedIn
    },
    pagina () {
      return this.$store.getters.pagina
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    },
    ppl () {
      window.location.href = '/'
    },
    cambiarParalelo (idParalelo) {
      this.sideNav = false
      this.$store.commit('setLoading', true)
      let paraleloActual = this.estudiante.paralelos.find((paralelo) => paralelo._id === idParalelo)
      this.$store.commit('setParaleloActual', paraleloActual)
      // this.$store.commit('sockets/cambiarParalelo', {paraleloAntiguo: this.paraleloActual.id, paraleloNuevo: idParalelo})
    }
  }
}
</script>
<style></style>
