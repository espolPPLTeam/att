<template>
  <main id="main">
    <section>
      <!-- Card pregunta profesor -->
      <v-layout row wrap v-if="preguntaProfesor">
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h4>Pregunta</h4>
            </v-card-title>
            <v-card-text>
              <p v-html="preguntaProfesor.texto" id="pregunta-content"></p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Card respuesta estudiante -->
      <v-layout row wrap v-if="respuesta">
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h4>Respuesta</h4>
            </v-card-title>
            <v-card-text>
              <p>{{respuesta.texto}}</p>
            </v-card-text>
            <v-card-text class="caption text-xs-right">
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
    <v-footer id="footer" class="pa-3" app>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-layout row justify-center>
              <v-flex xs10 lg11 id="div-respuesta">
                <v-text-field name="respuesta" label="Respuesta" id="respuesta" v-model="inputRespuesta"></v-text-field>
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
      return this.preguntaProfesor !== '' && this.preguntaProfesor !== undefined && this.loggedIn && this.inputRespuesta !== '' && this.inputRespuesta !== undefined
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
  #pregunta-content{
    text-align: justify;
  }
  #div-respuesta{
    padding-left: 2%
  }
  section{
    margin-bottom: 15vh !important;
  }
</style>
