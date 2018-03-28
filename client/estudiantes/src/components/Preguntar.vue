<template id="AppPreguntar">
  <main id="main">
    <section>
      <v-layout row wrap>
        <v-flex xs12 v-for="(pregunta, i) in preguntas" :key="i" class="mb-1">
          <v-card>
            <v-card-text class="text-xs-left">
              <p v-html="pregunta.texto" class="pa-2"></p>
            </v-card-text>
            <v-card-text class="caption text-xs-right">
              {{pregunta.createdAt | timeFromDate}}
              <v-icon v-if="pregunta.estado=='enviando'" class="ml-2">access_time</v-icon>
              <v-icon v-if="pregunta.estado=='enviada'" class="ml-2" color="green">check_circle</v-icon>
              <v-icon v-if="pregunta.estado=='no enviada'" class="ml-2" color="red">error</v-icon>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs2 lg1 id="div-icon">
          <v-btn class="mt-3" @click="sesionIniciada=!sesionIniciada">Iniciar Sesión</v-btn>
        </v-flex>
      </v-layout>
    </section>
    <v-footer id="footer" class="pa-3" app>
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-layout row justify-center>
              <v-flex xs10 lg11 id="div-pregunta">
                <v-text-field name="pregunta" label="Pregunta" id="pregunta" v-model="pregunta"></v-text-field>
              </v-flex>
              <v-flex xs2 lg1 id="div-icon">
                <v-btn icon class="mt-3" @click="preguntar" :disabled="!habilitado"><v-icon>send</v-icon></v-btn>
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
  computed: {
    preguntas () {
      return this.$store.getters.preguntas
    },
    habilitado () {
      return this.pregunta !== '' && this.pregunta !== undefined && this.sesionIniciada
    }
  },
  data () {
    return {
      pregunta: '',
      sesionIniciada: false
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
  section{
    margin-bottom: 15vh !important;
  }
</style>
