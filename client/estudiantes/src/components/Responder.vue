<template id="AppResponder">
  <main id="main">
    <section id="section-pregunta-profesor">
      <!-- Card pregunta profesor -->
      <v-layout row wrap v-if="preguntaProfesor">
        <v-flex xs12>
          <v-card hover>
            <v-card-title primary-title>
              <h3 class="mx-auto">Pregunta</h3>
            </v-card-title>
            <v-card-text class="text-xs-left px-3 pb-1 text-container">
              <p v-html="preguntaProfesor.texto"></p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Card respuesta estudiante -->
      <v-layout row wrap v-if="respuesta" class="mt-4">
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h4 class="mx-auto">Respuesta</h4>
            </v-card-title>
            <v-card-text class="text-container pb-1 px-3">
              <p>{{respuesta.texto}}</p>
            </v-card-text>
            <v-card-text class="caption text-xs-right pt-1 pb-2 px-3">
              {{respuesta.createdAt | timeFromDate}}
              <v-icon v-if="respuesta.estado=='enviando'" class="ml-2">access_time</v-icon>
              <v-icon v-if="respuesta.estado=='enviada'" class="ml-2" color="green">check_circle</v-icon>
              <v-icon v-if="respuesta.estado=='no enviada'" class="ml-2" color="red">error</v-icon>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </section>
    <!-- Input respuesta -->
    <v-footer id="footer" class="py-3 px-2" app>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-layout row justify-center>
              <v-flex xs10 lg11 id="div-respuesta">
                <v-text-field name="respuesta" label="Respuesta" id="respuesta" v-model="inputRespuesta" @keypress="keypressed($event)"></v-text-field>
              </v-flex>
              <v-flex xs2 lg1 id="div-icon">
                <v-btn icon class="mt-3" @click="responder" :disabled="!habilitado"><v-icon>send</v-icon></v-btn>
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
  name: 'Responder',
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    },
    habilitado () {
      return this.preguntaProfesor !== '' && this.preguntaProfesor !== undefined && this.loggedIn && this.inputRespuesta !== '' && this.inputRespuesta !== undefined && this.respuesta === null
    },
    preguntaProfesor () {
      return this.$store.getters.preguntaProfesor
    },
    respuesta () {
      return this.$store.getters.respuesta
    }
  },
  data () {
    return {
      inputRespuesta: ''
    }
  },
  methods: {
    responder () {
      this.$store.dispatch('responder', this.inputRespuesta)
      this.inputRespuesta = ''
    },
    keypressed (e) {
      const code = (e.keyCode ? e.keyCode : e.which)
      if (code === 13) {
        this.responder()
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
  #div-respuesta{
    padding-left: 2%
  }
  p{
    text-align: justify;
  }
  section{
    margin-bottom: 15vh !important;
  }
</style>
