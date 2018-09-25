<template>
  <v-container class="px-2 pt-2">
    <v-layout row wrap>
      <v-flex xs6 offset-xs3 wrap>
        <v-dialog ref="dialogFecha" v-model="dialogFecha" :return-value.sync="fecha" persistent lazy full-width width="290px">
          <v-text-field slot="activator" v-model="fecha" label="Seleccione la fecha" prepend-icon="event" readonly>
          </v-text-field>
          <v-date-picker v-model="fecha" scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="dialogFecha = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dialogFecha.save(fecha)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-progress-circular color="blue" class="my-3" :size="30" :width="3" v-if="loading" indeterminate>
    </v-progress-circular>
    <v-layout row wrap v-if="preguntasEstudiantes.length > 0">
      <v-flex xs12 v-for="(pregunta, i) in preguntasEstudiantes" :key="i" class="mb-1">
        <card-pregunta :pregunta="pregunta"></card-pregunta>
      </v-flex>
    </v-layout>
    <v-jumbotron color="grey lighten-2" v-else>
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">No hay preguntas que mostrar</h3>
            <span class="subheading">Los estudiantes del paralelo actual no hicieron preguntas este día.</span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </v-container>
</template>
<script>
import moment from 'moment'
export default {
  mounted () {
    this.fecha = new Date()
    this.fecha = moment(this.fecha).format('YYYY-MM-DD')
    this.getPreguntasEstudiantesDia(this.fecha, this.paraleloActual)
  },
  computed: {
    paraleloActual () {
      return this.$store.getters.paraleloActual
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    fecha (value) {
      this.getPreguntasEstudiantesDia(value, this.paraleloActual)
    },
    paraleloActual (value) {
      this.getPreguntasEstudiantesDia(this.fecha, value.id)
    }
  },
  data () {
    return {
      dialogFecha: false,
      fecha: '',
      preguntasEstudiantes: []
    }
  },
  methods: {
    getPreguntasEstudiantesDia (dia, paralelo) {
      this.$store.commit('setLoading', true)
      this.$store.commit('setError', false)
      const urlApi = `/api/att/profesor/preguntasEstudiantes/${this.paraleloActual.id}/${dia}`
      this.$http.get(urlApi)
        .then((response) => {
          console.log(response)
          this.$store.commit('setLoading', false)
          if (response.body.estado) {
            for (var i = response.body.datos.length - 1; i >= 0; i--) {
              this.$set(response.body.datos[i], 'show', false)
            }
            response.body.datos.sort((a, b) => {
              a = new Date(a.createdAt)
              b = new Date(b.createdAt)
              return a > b ? -1 : a < b ? 1 : 0
            })
            this.preguntasEstudiantes = response.body.datos
          } else {
            this.$store.commit('setError', response.body)
          }
        }, (err) => {
          this.$store.commit('setLoading', false)
          this.$store.commit('setError', err)
        })
    }
  }
}
</script>
<style scoped>

</style>
