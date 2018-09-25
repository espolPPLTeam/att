<template>
  <v-container class="px-2 pt-2">
    <v-progress-circular class="my-3" indeterminate :size="30" :width="3" color="blue" v-if="loading"></v-progress-circular>
    <!-- Barra búsqueda && filtro -->
    <v-card class="hidden-xs-only mb-3">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs7 sm8 md10 class="pr-5 pl-1">
            <v-text-field label="Búsqueda" append-icon="search" :append-icon-cb="buscar" v-model="busqueda" @keypress="keypressed($event)"></v-text-field>
          </v-flex>
          <v-flex xs5 sm4 md2>
            <v-select :items="opciones" item-text="texto" item-value="value" v-model="filtro" label="Filtro" dense></v-select>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <!-- Preguntas -->
    <v-layout row wrap v-if="preguntasMostrar.length > 0">
      <v-flex xs12 v-for="(pregunta, i) in preguntasMostrar" :key="i" class="mb-1">
        <card-pregunta :pregunta="pregunta"></card-pregunta>
      </v-flex>
    </v-layout>
    <v-jumbotron color="grey lighten-2" v-else>
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">No hay preguntas que mostrar</h3>
            <span class="subheading">Los estudiantes del paralelo actual no han hecho preguntas aún.</span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </v-container>
</template>
<script>
export default {
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    pagina () {
      return this.$store.getters.pagina
    },
    preguntasMostrar () {
      return this.$store.getters['preguntas/preguntasMostrar']
    }
  },
  watch: {
    filtro () {
      this.$store.commit('preguntas/filtrar', { filtro: this.filtro })
    }
  },
  data () {
    return {
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
          texto: 'Poco relevantes'
        },
        {
          valor: 3,
          texto: 'Relevantes'
        }
      ],
      busqueda: ''
    }
  },
  mounted () {
    this.$store.commit('setPagina', 'Preguntas')
    this.$store.commit('setPreguntaNueva', false)
    this.$store.commit('setFiltro', 'Todas')
  },
  methods: {
    buscar () {
      this.$store.commit('preguntas/buscar', { filtro: this.filtro, busqueda: this.busqueda })
    },
    keypressed (e) {
      const code = (e.keyCode ? e.keyCode : e.which)
      if (code === 13) {
        this.buscar()
      }
    }
  }
}
</script>
<style>
  .hidden-info{
    display: inline-flex;
  }
</style>
