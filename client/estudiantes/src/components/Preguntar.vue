<template id="AppPreguntar">
  <main id="main">
    <section id="section-preguntas">
      <v-layout row wrap v-if="preguntas.length > 0">
        <v-flex xs12 v-for="(pregunta, i) in preguntas" :key="i" class="mb-1">
          <v-card hover>
            <v-card-text class="text-xs-left px-3 pb-1 text-container">
              <p v-html="pregunta.texto"></p>
            </v-card-text>
            <v-card-text class="caption text-xs-right pt-1 pb-2 px-3">
              {{pregunta.createdAt | timeFromDate}}
              <v-icon v-if="pregunta.estado=='enviando'" class="ml-2">access_time</v-icon>
              <v-icon v-if="pregunta.estado=='enviada'" class="ml-2" color="green">check_circle</v-icon>
              <v-icon v-if="pregunta.estado=='no enviada'" class="ml-2" color="red">error</v-icon>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-jumbotron color="grey lighten-2" v-else>
        <v-container fill-height>
          <v-layout align-center>
            <v-flex>
              <h3 class="display-3">No has hecho ninguna pregunta hoy</h3>
              <span class="subheading">Recuerda que le puedes hacer una pregunta al profesor, de manera anónima, en cualquier momento de la clase</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-jumbotron>
    </section>
    <v-footer id="footer" class="py-3 px-2" app>
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-layout row justify-center>
              <v-flex xs10 lg11 id="div-pregunta">
                <v-text-field name="pregunta" label="Pregunta" id="pregunta" v-model="pregunta" @keypress="keypressed($event)" auto-grow multi-line rows="1"></v-text-field>
              </v-flex>
              <v-flex xs2 lg1 id="div-icon">
                <v-btn icon class="mt-3" @click="preguntar" :disabled="!habilitado"><v-icon color="green">send</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </main>
</template>
<script>
export default {
  name: 'Preguntar',
  mounted () {
    this.$store.commit('setPagina', 'Preguntar')
  },
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    },
    preguntas () {
      return this.$store.getters.preguntas
    },
    habilitado () {
      return this.pregunta !== '' && this.pregunta !== undefined && this.loggedIn
    }
  },
  data () {
    return {
      pregunta: ''
    }
  },
  methods: {
    preguntar () {
      if (!this.habilitado) {
        return
      }
      const pregunta = {
        createdAt: new Date(),
        texto: this.pregunta,
        estado: 'enviando'
      }
      this.$store.dispatch('anadirPregunta', pregunta)
      this.pregunta = ''
    },
    keypressed (e) {
      const code = (e.keyCode ? e.keyCode : e.which)
      if (code === 13) {
        this.pregunta = this.pregunta + '\n'
      }
    }
  }
}
</script>
<style scoped>
  #main{
    height: 100vh;
  }
  #footer{
    height: auto !important;
    background: #fafafa;
  }
  #div-pregunta{
    padding-left: 2%
  }
  p{
    text-align: justify;
  }
  #section-preguntas{
    margin-bottom: 30vh !important;
  }
  .caption{
    color: grey;
  }
</style>
