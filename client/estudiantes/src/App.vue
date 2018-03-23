<template>
  <v-app id="app">
    <v-toolbar app dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Ask The Teacher</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-tabs centered grow>
        <v-tab :to="{name:'Preguntar'}">Preguntar</v-tab>
        <v-tab :to="{name:'Responder'}">Responder</v-tab>
      </v-tabs>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
