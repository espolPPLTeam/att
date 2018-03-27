<template id="AppPreguntar">
  <main id="main">
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-list three-line>
            <div v-for="(pregunta, i) in preguntas" :key="i">
              <v-divider></v-divider>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title v-html="pregunta.texto"></v-list-tile-title>
                  <v-list-tile-sub-title class="caption text-xs-right">{{pregunta.createdAt | moment}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </div>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <v-footer id="footer" class="pa-3" app>
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-layout row justify-center>
              <v-flex xs10 lg11 id="div-pregunta">
                <v-text-field name="pregunta" label="Pregunta" id="pregunta" v-model="pregunta"></v-text-field>
              </v-flex>
              <v-flex xs2 lg1 id="div-icon">
                <v-btn icon class="mt-3" @click="preguntar"><v-icon>send</v-icon></v-btn>
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
    }
  },
  data () {
    return {
      pregunta: ''
    }
  },
  methods: {
    preguntar () {
      const pregunta = {
        createdAt: new Date(),
        texto: this.pregunta
      }
      this.$store.dispatch('anadirPregunta', pregunta)
      this.pregunta = ''
    }
  },
  mounted () {
    console.log('Preguntar Mounted')
  }
}
</script>
<style>
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
</style>
