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
                class="text-xs-right continue"
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
      <v-flex xs12 class="hidden-xs-only mt-5">
        <v-layout row wrap>
          <v-flex xs7 sm8 md8 class="pr-5 pl-1">
            <v-text-field label="Búsqueda" append-icon="search" :append-icon-cb="buscarRespuestas" v-model="busqueda" @keypress="keypressedBusqueda($event)"></v-text-field>
          </v-flex>
          <v-flex xs5 sm2 md2>
            <v-select :items="opciones" item-text="texto" item-value="value" v-model="filtro" label="Filtro" dense></v-select>
          </v-flex>
          <v-flex sm2 md2 class="hidden-xs-only mt-1">
            <v-btn class="red white--text"  @click.native="dialog = !dialog">Terminar</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Respuestas estudiantes -->
      <v-flex xs12 v-for="(respuesta, i) in respuestasMostrar" :key="i" class="mb-1">
        <card-respuesta :respuesta="respuesta"></card-respuesta>
      </v-flex>
      <!-- Btn terminar -->
      <div id="footer" class="hidden-sm-and-up">
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
    this.pregunta = this.$store.getters['respuestas/pregunta']
    this.$store.commit('setPagina', 'Respuestas')
    this.$store.commit('setRespuestaNueva', false)
    this.$store.commit('setFiltro', 'Todas')
  },
  computed: {
    sesionRespuestas () {
      return this.$store.getters.sesionRespuestas
    },
    respuestasMostrar () {
      return this.$store.getters['respuestas/respuestasMostrar']
    },
    loading () {
      return this.$store.getters.loading
    },
    enviarPreguntaHabilitado () {
      return this.pregunta !== '' && this.pregunta !== undefined && !this.loading
    },
    pagina () {
      return this.$store.getters.pagina
    }
  },
  watch: {
    filtro () {
      this.$store.commit('respuestas/filtrar', { filtro: this.filtro })
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
          texto: 'Buenas'
        },
        {
          valor: 3,
          texto: 'Muy buenas'
        }
      ]
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
        this.$store.dispatch('respuestas/enviarPregunta', this.pregunta.texto)
      } else {
        this.snackbar.estado = true
      }
    },
    buscarRespuestas () {
      this.$store.commit('respuestas/buscar', {busqueda: this.busqueda, filtro: this.filtro})
    },
    terminarSesionRespuestas () {
      this.dialog = false
      this.pregunta = { texto: '' }
      this.$store.dispatch('respuestas/terminarSesionRespuestas')
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
