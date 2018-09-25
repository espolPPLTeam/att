<template>
  <section class="star-rating">
    <label
      @click.prevent
      class="star-rating__star"
      v-for="(rating, i) in ratings"
      :key="i"
      :class="{'is-selected': ((temp_value >= rating) && temp_value != null)}"
      v-on:click="set(rating)"
      v-on:mouseover="star_over(rating)"
      v-on:mouseout="star_out">
        <input class="star-rating star-rating__checkbox" type="radio" :value="rating">
        ★
    </label>
  </section>
</template>
<script>
export default {
  mounted () {
    this.temp_value = this.value
  },
  props: {
    'value': null,
    'id': String,
    'tipo': String
  },
  data () {
    return {
      temp_value: null,
      ratings: [1, 2, 3]
    }
  },
  methods: {
    /*
     * Behaviour of the stars on mouseover.
     */
    star_over (index) {
      if (!this.disabled) {
        this.temp_value = index
      }
    },
    /*
     * Behaviour of the stars on mouseout.
     */
    star_out () {
      if (!this.disabled) {
        this.temp_value = this.value
      }
    },
    /*
     * Set the rating of the score
     */
    set (value) {
      if (this.tipo === 'pregunta') {
        this.$store.commit('preguntas/calificarPregunta', {id: this.id, calificacion: value})
        this.$store.dispatch('preguntas/calificarPregunta', {id: this.id, calificacion: value, calificacionAntigua: this.value})
        this.temp_value = value
      } else if (this.tipo === 'respuesta') {
        this.$store.commit('respuestas/calificarRespuesta', {id: this.id, calificacion: value})
        this.$store.dispatch('respuestas/calificarRespuesta', {id: this.id, calificacion: value, calificacionAntigua: this.value})
      }
    }
  }
}
</script>
<style scoped>
  .star-rating__checkbox {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
  }

  .star-rating__star {
    display: inline-block;
    padding: 3px;
    vertical-align: middle;
    line-height: 1;
    font-size: 1.5em;
    color: #ABABAB;
    transition: color .2s ease-out;
  }

  .star-rating__star:hover {
    cursor: pointer;
  }

  .star-rating__star.is-selected {
    color: #FFD700;
  }

  .star-rating__star.is-disabled:hover {
    cursor: default;
  }
</style>
