<template>
  <main>
    <!-- Sidenav mobile -->
    <v-navigation-drawer temporary v-model="sideNav" app>
      <v-list>
        <!-- Usuario -->
        <v-list-group prepend-icon="account_circle" value="true" v-if="usuario && paralelos">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ usuario.correo.split('@')[0] }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ paraleloActual.nombre }} - {{ paraleloActual.curso }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="paralelo in paralelos" :key="paralelo._id" @click="cambiarParalelo(paralelo.id)">
            <v-list-tile-action>
              <v-icon></v-icon>
            </v-list-tile-action>
            <v-list-tile-title>
              {{ paralelo.nombre }} - P{{ paralelo.curso }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
          <v-list-tile-action>
            <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- Toolbar desktop -->
    <v-toolbar app dark class="hidden-xs-only">
      <v-toolbar-title class="white--text">Ask The Teacher</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y v-if="paralelos && paraleloActual">
          <v-btn dark slot="activator" id="btnMenuDesktop">
            {{ paraleloActual.nombre }} - {{ paraleloActual.curso }}
            <v-icon dark class="ml-2">arrow_drop_down</v-icon>
          </v-btn>
          <v-list dark>
            <v-list-tile v-for="paralelo in paralelos" :key="paralelo._id" @click="cambiarParalelo(paralelo.id)">
              <v-list-tile-title>{{ paralelo.nombre }} - {{ paralelo.curso }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-badge v-if="loggedIn" v-model="preguntaNueva" color="red darken-1" overlap>
          <v-icon slot="badge">!</v-icon>
          <v-btn flat router :to="'/preguntas'">
            Preguntas
          </v-btn>
        </v-badge>
        <v-badge v-if="loggedIn" v-model="respuestaNueva" color="red darken-1" overlap>
          <v-icon slot="badge">!</v-icon>
          <v-btn flat router :to="'/respuestas'">Respuestas</v-btn>
        </v-badge>
        <v-btn flat v-if="loggedIn" router :to="'historial'">
          Historial
        </v-btn>
        <v-btn flat v-if="loggedIn" @click="logout">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Toolbar mobile -->
    <v-toolbar app dark scroll-off-screen class="hidden-sm-and-up">
      <v-toolbar-side-icon @click.native="sideNav = !sideNav" class="hidden-sm-and-up" v-if="loggedIn">
      </v-toolbar-side-icon>
      <v-toolbar-title class="white--text" style="font-size:initial;" v-if="loggedIn && paraleloActual">
        <h3 class="titulo-toolbar">{{ paraleloActual.nombre }}</h3>
        <span class="subtitulo-toolbar">P{{ paraleloActual.curso }} - {{ filtro }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="mr-2" v-if="loggedIn">
        <!--<v-btn icon class="mr-2">
          <v-icon>search</v-icon>
        </v-btn>-->
        <v-menu dark>
          <v-btn icon slot="activator">
            <v-icon>sort</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="filtrar(x)" v-for="x in opciones" :key="x.texto">
              <v-list-tile-title>{{ x.texto }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
  </main>
</template>
<script>
export default {
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    },
    filtro () {
      return this.$store.getters.filtro
    },
    pagina () {
      return this.$store.getters.pagina
    },
    usuario () {
      return this.$store.getters.usuario
    },
    paralelos () {
      return this.$store.getters.paralelos
    },
    paraleloActual () {
      return this.$store.getters.paraleloActual
    },
    loading () {
      return this.$store.getters.loading
    },
    preguntaNueva () {
      return this.$store.getters.preguntaNueva
    },
    respuestaNueva () {
      return this.$store.getters.respuestaNueva
    }
  },
  data () {
    return {
      e3: 1,
      sideNav: false,
      menuItems: [
        {
          title: 'Preguntas',
          link: '/preguntas',
          icon: 'fas fa-question'
        },
        {
          title: 'Respuestas',
          link: '/respuestas',
          icon: 'question_answer'
        },
        {
          title: 'Historial',
          link: '/historial',
          icon: 'calendar_today'
        }
      ],
      opciones: [
        {
          valor: 0,
          texto: 'Todas'
        },
        {
          valor: 1,
          texto: 'No enfocadas'
        },
        {
          valor: 2,
          texto: 'Poco relevantes'
        },
        {
          valor: 3,
          texto: 'Relevantes'
        }
      ]
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    },
    filtrar (filtro) {
      this.$store.dispatch('filtrar', {filtro: filtro, pagina: this.pagina})
    },
    cambiarParalelo (idParalelo) {
      this.sideNav = false
      this.$store.commit('setLoading', true)
      this.$store.commit('sockets/cambiarParalelo', {paraleloAntiguo: this.paraleloActual.id, paraleloNuevo: idParalelo})
    }
  }
}
</script>
<style></style>
