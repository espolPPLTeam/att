<template>
  <v-card hover>
    <v-layout row>
      <!-- Calificar -->
      <v-flex xs2 sm3 lg2 v-show="pregunta.show">
        <v-card-actions>
          <v-container fluid fill-height>
            <v-layout align-center justify-center row wrap>
              <v-flex xs12>
                <star :value="pregunta.calificacion" :id="pregunta.id" :tipo="'pregunta'"></star>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-flex>
      <!-- Texto && Fecha -->
      <v-flex xs12>
        <v-card-text class="text-xs-left pa-1 text-container">
          <p v-html="pregunta.texto" class="pa-2 texto-pregunta"></p>
        </v-card-text>
        <v-card-text class="caption text-xs-right pa-2">
          {{ pregunta.createdAt | timeFromDate }}
        </v-card-text>
      </v-flex>
    </v-layout>
    <!-- Creador -->
    <v-layout row>
      <v-flex xs12>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="pregunta.show = !pregunta.show">
            <v-icon v-if="!pregunta.show">arrow_drop_down</v-icon>
            <v-icon v-else>arrow_drop_up</v-icon>
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="pregunta.show" class="hidden-info">
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <p class="text-xs-center text-sm-left">
                  <v-icon class="mr-2">person</v-icon>
                  {{ pregunta.creador.nombres }} {{ pregunta.creador.apellidos }}
                </p>
              </v-flex>
              <v-flex xs12 sm6>
                <p class="text-xs-center text-sm-right">
                  <v-icon class="mr-2">email</v-icon>
                  {{ pregunta.creador.correo }}
                </p>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-slide-y-transition>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  props: {
    pregunta: Object
  }
}
</script>
