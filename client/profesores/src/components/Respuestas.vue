<template>
  <v-container>
    <header class="mb-5">
      <h3 class="display-1">Respuestas</h3>
    </header>
    <v-layout row v-if="sesionRespuestas === 'inactivo'">
      <v-flex xs12 sm10 md6 offset-md3 offset-sm1>
        <v-card>
          <v-card-text>
            <v-text-field label="Pregunta" name="pregunta" id="pregunta" v-model="pregunta"  @keypress="keypressed($event)" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-layout row>
              <v-flex xs12>
                <v-btn class="text-xs-right red white--text" @click="preguntarEstudiantes">Enviar</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-snackbar
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        v-model="snackbar.estado">
        {{snackbar.text}}
      </v-snackbar>
    </v-layout>
    <v-layout row v-if="sesionRespuestas === 'activo'" wrap>
      <v-flex xs12 class="mb-5">
        <v-card>
          <v-card-title>
            <h4 primary-title>Pregunta</h4>
          </v-card-title>
          <v-card-text>
            <p>{{ pregunta }}</p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex xs7 sm8 md10 class="pr-5 pl-1">
            <v-text-field label="Búsqueda" append-icon="search" :append-icon-cb="buscarRespuestas" v-model="busqueda" @keypress="keypressedBusqueda($event)"></v-text-field>
          </v-flex>
          <v-flex xs5 sm4 md2>
            <v-select
            :items="opciones"
            v-model="filtro"
            label="Filtro"></v-select>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 v-for="(respuesta, i) in respuestas" :key="i" class="mb-1">
        <v-card hover>
          <v-layout row wrap>
            <v-flex xs2>
              <v-card-actions>
                <v-icon v-if="respuesta.marcada" class="mx-auto mt-3" color="yellow darken-2" @click="marcarRespuesta(respuesta._id, !respuesta.marcada)">bookmark</v-icon>
                <v-icon v-else class="mx-auto mt-3" @click="marcarRespuesta(respuesta._id, !respuesta.marcada)">bookmark_border</v-icon>
              </v-card-actions>
            </v-flex>
            <v-flex xs10>
              <v-card-text class="text-xs-left pa-1">
                <p v-html="respuesta.texto" class="pa-2"></p>
              </v-card-text>
              <v-card-text class="caption text-xs-right pa-2">
                {{ respuesta.createdAt | timeFromDate }}
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-card-actions row>
            <v-spacer></v-spacer>
            <v-btn icon @click="respuesta.show = !respuesta.show">
              <v-icon v-if="!respuesta.show">arrow_drop_down</v-icon>
              <v-icon v-else>arrow_drop_up</v-icon>
            </v-btn>
          </v-card-actions>
          <v-slide-y-transition>
            <v-card-text v-show="respuesta.show" class="hidden-info">
              <p class="text-xs-left ml-4"><v-icon class="mr-3">person</v-icon>{{ respuesta.creador.nombres }} {{ respuesta.creador.apellidos }}</p>
              <v-spacer></v-spacer>
              <p class="text-xs-right mr-4"><v-icon class="mr-3">email</v-icon>{{ respuesta.creador.correo }}</p>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  mounted () {
    this.pregunta = this.$store.getters.pregunta
  },
  computed: {
    sesionRespuestas () {
      return this.$store.getters.sesionRespuestas
    },
    respuestas () {
      return this.$store.getters.respuestasMostrar
    }
  },
  watch: {
    filtro () {
      this.$store.commit('filtrarRespuestas', this.filtro)
    }
  },
  data () {
    return {
      pregunta: '',
      snackbar: {
        color: 'red',
        timeout: 3000,
        estado: false,
        text: 'La pregunta no puede estar vacía'
      },
      busqueda: '',
      filtro: 'Todas',
      opciones: ['Todas', 'Marcadas']
    }
  },
  methods: {
    keypressed (e) {
      const code = (e.keyCode ? e.keyCode : e.which)
      if (code === 13) {
        this.preguntarEstudiantes()
      }
    },
    keypressedBusqueda (e) {
      const code = (e.keyCode ? e.keyCode : e.which)
      if (code === 13) {
        this.buscarRespuestas()
      }
    },
    preguntarEstudiantes () {
      if (this.pregunta !== undefined && this.pregunta !== '') {
        this.snackbar.estado = false
        this.$store.commit('iniciarSesionRespuestas')
        this.$store.commit('SOCKET_PREGUNTA_PROFESOR', this.pregunta)
      } else {
        this.snackbar.estado = true
      }
    },
    marcarRespuesta (id, estado) {

    },
    buscarRespuestas () {
      this.$store.commit('buscarRespuestas', {busqueda: this.busqueda, filtro: this.filtro})
    }
  }
}
</script>
<style scoped>
  .hidden-info{
    display: inline-flex;
  }
</style>
