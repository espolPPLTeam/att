<template>
  <v-layout row class="mt-5">
    <v-flex xs12 sm9 offset-sm1>
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="login">
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Usuario" name="usuario" id="usuario" type="text" v-model="usuario" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Contraseña" name="contrasenna" id="contrasenna" type="password" v-model="contrasenna" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-btn type="submit" class="right red white--text" :disabled="!habilitado">Login</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  computed: {
    habilitado () {
      return this.usuario !== '' && this.usuario !== undefined && this.contrasenna !== '' && this.contrasenna !== undefined
    },
    loggedIn () {
      return this.$store.getters.loggedIn
    }
  },
  data () {
    return {
      usuario: '',
      contrasenna: ''
    }
  },
  methods: {
    login () {
      const data = {
        usuario: this.usuario,
        contrasenna: this.contrasenna
      }
      this.$store.dispatch('login', data)
      this.$router.push('/preguntar')
    }
  }
}
</script>
