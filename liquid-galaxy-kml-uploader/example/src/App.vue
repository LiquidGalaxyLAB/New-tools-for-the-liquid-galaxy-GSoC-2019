<template>
  <v-app>
    <v-toolbar dark app>
      <v-btn to="/">Home </v-btn>
      <v-toolbar-title class="headline text-uppercase">
        <span>KML API Test</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  }
}
</script>
