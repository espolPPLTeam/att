<template>
  <v-container>
    <header>
      <h1 class="">Preguntas</h1>
    </header>
    <v-layout row wrap>
      <v-flex xs7 sm8 md10 class="pr-5 pl-1">
        <v-text-field label="Búsqueda" append-icon="search" :append-icon-cb="buscar" v-model="busqueda" @keypress="keypressed($event)"></v-text-field>
      </v-flex>
      <v-flex xs5 sm4 md2>
        <v-select
        :items="opciones"
        v-model="filtro"
        label="Filtro"></v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-3">
      <v-flex xs12 v-for="(pregunta, i) in preguntas" :key="i" class="mb-1">
        <v-card hover>
          <v-layout row wrap>
            <v-flex xs2>
              <v-card-actions>
                <v-icon v-if="pregunta.destacada" class="mx-auto mt-3" color="yellow darken-2" @click="destacarPregunta(pregunta._id, !pregunta.destacada)">star</v-icon>
                <v-icon v-else class="mx-auto mt-3" @click="destacarPregunta(pregunta._id, !pregunta.destacada)">star_border</v-icon>
              </v-card-actions>
            </v-flex>
            <v-flex xs10>
              <v-card-text class="text-xs-left pa-1">
                <p v-html="pregunta.texto" class="pa-2"></p>
              </v-card-text>
              <v-card-text class="caption text-xs-right pa-2">
                {{ pregunta.createdAt | timeFromDate }}
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-card-actions row>
            <v-spacer></v-spacer>
            <v-btn icon @click="pregunta.show = !pregunta.show">
              <v-icon v-if="!pregunta.show">arrow_drop_down</v-icon>
              <v-icon v-else>arrow_drop_up</v-icon>
            </v-btn>
          </v-card-actions>
          <v-slide-y-transition>
            <v-card-text v-show="pregunta.show" class="hidden-info">
              <p class="text-xs-left ml-4"><v-icon class="mr-3">person</v-icon>{{ pregunta.creador.nombres }} {{ pregunta.creador.apellidos }}</p>
              <v-spacer></v-spacer>
              <p class="text-xs-right mr-4"><v-icon class="mr-3">email</v-icon>{{ pregunta.creador.correo }}</p>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  computed: {
    preguntas () {
      return this.$store.getters.preguntasMostrar
    }
  },
  watch: {
    filtro () {
      this.$store.commit('filtrar', this.filtro)
    }
  },
  data () {
    return {
      filtro: 'Todas',
      opciones: ['Todas', 'Destacadas'],
      busqueda: ''
    }
  },
  methods: {
    destacarPregunta (id, estado) {
      this.$store.dispatch('destacarPregunta', {id: id, estado: estado})
    },
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
