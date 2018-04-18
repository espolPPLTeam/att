<template>
  <v-container class="px-2 pt-2">
    <!-- Ingreso de pregunta -->
    <v-layout row v-if="sesionRespuestas === 'inactivo'" style="margin-top:25vh">
      <v-flex xs12 sm10 md6 offset-md3 offset-sm1>
        <v-card>
          <v-card-text>
            <v-text-field label="Pregunta" name="pregunta" id="pregunta" v-model="pregunta.texto"  @keypress="keypressed($event)" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-layout row>
              <v-flex xs12>
                <v-btn
                class="text-xs-right red white--text"
                @click="preguntarEstudiantes"
                :loading="loading" :disabled="!enviarPreguntaHabilitado">
                  Enviar
                </v-btn>
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
    <!-- Respuestas -->
    <v-layout row v-if="sesionRespuestas === 'activo'" wrap>
      <!-- Pregunta enviada -->
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h4 primary-title class="mx-auto">Pregunta</h4>
          </v-card-title>
          <v-card-text class="text-container">
            <p>{{ pregunta.texto }}</p>
          </v-card-text>
        </v-card>
      </v-flex>
      <h3 class="mx-auto my-3">Respuestas</h3>
      <!-- Búsqueda y filtros (Desktop)-->
      <v-flex xs12 class="hidden-sm-and-down mt-5">
        <v-layout row wrap>
          <v-flex xs7 sm8 md8 class="pr-5 pl-1">
            <v-text-field label="Búsqueda" append-icon="search" :append-icon-cb="buscarRespuestas" v-model="busqueda" @keypress="keypressedBusqueda($event)"></v-text-field>
          </v-flex>
          <v-flex xs5 sm2 md2>
            <v-select
            :items="opciones"
            v-model="filtro"
            label="Filtro"></v-select>
          </v-flex>
          <v-flex sm2 md2 class="hidden-xs-only mt-1">
            <v-btn class="red white--text">Terminar</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Respuestas estudiantes -->
      <v-flex xs12 v-for="(respuesta, i) in respuestas" :key="i" class="mb-1">
        <v-card hover>
          <v-layout row wrap>
            <v-flex xs2>
              <v-card-actions>
                <v-icon v-if="respuesta.destacada" class="mx-auto mt-3" color="yellow darken-2" @click="destacarRespuesta(respuesta._id, !respuesta.destacada)">bookmark</v-icon>
                <v-icon v-else class="mx-auto mt-3" @click="destacarRespuesta(respuesta._id, !respuesta.destacada)">bookmark_border</v-icon>
              </v-card-actions>
            </v-flex>
            <v-flex xs10>
              <v-card-text class="text-xs-left pa-1 text-container">
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
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <p class="text-xs-center text-sm-left">
                    <v-icon class="mr-2">person</v-icon>
                    {{ respuesta.creador.nombres }} {{ respuesta.creador.apellidos }}
                  </p>
                </v-flex>
                <v-flex xs12 sm6>
                  <p class="text-xs-center text-sm-right">
                    <v-icon class="mr-2">email</v-icon>
                    {{ respuesta.creador.correo }}
                  </p>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
      <!-- Btn terminar -->
      <div id="footer" class="hidden-md-and-up">
        <v-btn large icon class="mx-auto red white--text" @click.native="dialog = !dialog">
          <v-icon medium>alarm</v-icon>
        </v-btn>
      </div>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-text>¿Seguro que desea terminar la sesión de respuestas?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog = false">No</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click.native="terminarSesionRespuestas"
            :loading="loading">
              Si
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  mounted () {
    this.pregunta = this.$store.getters.pregunta
    this.$store.commit('setPagina', 'Respuestas')
  },
  computed: {
    sesionRespuestas () {
      return this.$store.getters.sesionRespuestas
    },
    respuestas () {
      return this.$store.getters.respuestasMostrar
    },
    loading () {
      return this.$store.getters.loading
    },
    enviarPreguntaHabilitado () {
      return this.pregunta !== '' && this.pregunta !== undefined && !this.loading
    }
  },
  watch: {
    filtro () {
      this.$store.commit('filtrarRespuestas', this.filtro)
    }
  },
  data () {
    return {
      dialog: false,
      pregunta: {texto: ''},
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
        this.$store.dispatch('enviarPregunta', this.pregunta.texto)
      } else {
        this.snackbar.estado = true
      }
    },
    destacarRespuesta (id, estado) {
      this.$store.dispatch('destacarRespuesta', {id, estado})
    },
    buscarRespuestas () {
      this.$store.commit('buscarRespuestas', {busqueda: this.busqueda, filtro: this.filtro})
    },
    terminarSesionRespuestas () {
      this.dialog = false
      this.pregunta = {texto: ''}
      this.$store.dispatch('terminarSesionRespuestas')
    }
  }
}
</script>
<style scoped>
  .hidden-info{
    display: inline-flex;
  }
  #footer{
    background: rgba(250, 250, 250, 0);
    position: fixed;
    bottom: 20vh;
    width: 100%;
    height: 1px;
  }
</style>
