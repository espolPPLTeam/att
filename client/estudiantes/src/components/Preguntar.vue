<template id="AppPreguntar">
  <main id="main">
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-list three-line>
            <div v-for="pregunta in preguntas" :key="pregunta.nombre">
              <v-divider></v-divider>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title v-html="pregunta.descripcion"></v-list-tile-title>
                  <v-list-tile-sub-title class="caption text-xs-right">{{pregunta.fecha | moment}}</v-list-tile-sub-title>
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
  data () {
    return {
      pregunta: '',
      preguntas: [
        {
          descripcion: 'Esta es la pregunta 1',
          fecha: new Date()
        },
        {
          descripcion: 'Esta es la pregunta 2',
          fecha: new Date()
        },
        {
          descripcion: 'Esta es la pregunta 3',
          fecha: new Date()
        }
      ]
    }
  },
  methods: {
    preguntar () {
      const pregunta = {
        fecha: new Date(),
        descripcion: this.pregunta
      }
      this.preguntas.push(pregunta)
      this.pregunta = ''
    }
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
