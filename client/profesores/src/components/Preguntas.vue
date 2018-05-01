<template>
  <v-container class="px-2 pt-2">
    <v-progress-circular
      class="my-3"
      indeterminate
      :size="30"
      :width="3"
      color="blue"
      v-if="loading">
    </v-progress-circular>
    <!-- Barra búsqueda && filtro -->
    <v-layout row wrap class="hidden-xs-only mb-3">
      <v-flex xs7 sm8 md10 class="pr-5 pl-1">
        <v-text-field label="Búsqueda" append-icon="search" :append-icon-cb="buscar" v-model="busqueda" @keypress="keypressed($event)"></v-text-field>
      </v-flex>
      <v-flex xs5 sm4 md2>
        <v-select :items="opciones" v-model="filtro" label="Filtro"></v-select>
      </v-flex>
    </v-layout>
    <!-- Preguntas -->
    <v-layout row wrap>
      <v-flex xs12 v-for="(pregunta, i) in preguntas" :key="i" class="mb-1">
        <card-pregunta :pregunta="pregunta"></card-pregunta>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  computed: {
    preguntas () {
      return this.$store.getters.preguntasMostrar
    },
    loading () {
      return this.$store.getters.loading
    },
    pagina () {
      return this.$store.getters.pagina
    }
  },
  watch: {
    filtro () {
      this.$store.commit('filtrar', {filtro: this.filtro, pagina: this.pagina})
    }
  },
  data () {
    return {
      filtro: 'Todas',
      opciones: ['Todas', 'Destacadas'],
      busqueda: ''
    }
  },
  mounted () {
    this.$store.commit('setPagina', 'Preguntas')
    this.$store.commit('setPreguntaNueva', false)
  },
  methods: {
    buscar () {
      this.$store.commit('buscar', {busqueda: this.busqueda, filtro: this.filtro})
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
