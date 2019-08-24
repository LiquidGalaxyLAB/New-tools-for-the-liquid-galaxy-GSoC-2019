<template>
  <v-container>
    <v-layout class="btnContainer" align-center wrap justify-space-around fill-height>
      <v-btn large dark class="btnOption" to="build">Draw</v-btn>
      <v-btn large dark class="btnOption" to="manage">Manage KML</v-btn>

    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({

    })
  }
</script>

<style>

.btnOption{
  width: 40%;
}

</style>
