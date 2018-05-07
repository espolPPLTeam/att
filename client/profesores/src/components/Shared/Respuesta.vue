<template>
  <v-card hover>
    <v-layout row>
      <!-- Calificar -->
      <v-flex xs2 sm3 lg2 v-show="respuesta.show">
        <v-card-actions>
          <v-container fluid fill-height>
            <v-layout align-center justify-center row wrap>
              <v-flex xs12>
                <star :value="respuesta.calificacion" :id="respuesta.id" :tipo="'respuesta'"></star>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-flex>
      <!-- Texto && Fecha -->
      <v-flex xs12>
        <v-card-text class="text-xs-left pa-1 text-container">
          <p v-html="respuesta.texto" class="pa-2 texto-respuesta"></p>
        </v-card-text>
        <v-card-text class="caption text-xs-right pa-2">
          {{ respuesta.createdAt | timeFromDate }}
        </v-card-text>
      </v-flex>
    </v-layout>
    <!-- Creador -->
    <v-layout row>
      <v-flex xs12>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="respuesta.show = !respuesta.show">
            <v-icon>{{ respuesta.show ? 'arrow_drop_up' : 'arrow_drop_down' }}</v-icon>
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
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  props: {
    respuesta: Object
  }
}
</script>
