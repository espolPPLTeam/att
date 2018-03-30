<template>
  <main id="main">
    <section>
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h4>Pregunta</h4>
            </v-card-title>
            <v-card-text>
              <p v-html="pregunta" id="pregunta-content"></p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row v-if="respondio">
        <v-flex>
          <v-card>
            <v-card-title>
              <h4>Respuesta</h4>
            </v-card-title>
            <v-card-text>
              <p>{{respuesta}}</p>
              <span class="caption text-xs-right">{{fecha | moment}}</span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </section>
    <v-footer id="footer" class="pa-3" app>
      <v-layout row>
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
      return this.pregunta !== '' && this.pregunta !== undefined && this.loggedIn
    }
  },
  data () {
    return {
      respondio: false,
      inputRespuesta: '',
      respuesta: '',
      fecha: '',
      pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rhoncus massa nisl, vitae congue erat aliquet vel. Nulla mi mi, convallis a molestie sit amet, tempus eget eros. Proin pharetra ligula ut velit tincidunt, nec porttitor ex imperdiet'
    }
  },
  methods: {
    responder () {
      this.respuesta = this.inputRespuesta
      this.inputRespuesta = ''
      this.respondio = true
      this.fecha = new Date()
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
