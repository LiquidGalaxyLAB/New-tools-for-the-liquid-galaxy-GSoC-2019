<template id="">
    <v-container>
      <v-layout align-center justify-center row fill-height>
        <v-flex xs12 sm12 >
      <v-card>
        <v-toolbar  dark>
          <v-toolbar-title>KML LIST</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <v-list-group
            v-for="kml in kmlList"
            :key="kml.id"

          >
             <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{ kml.name }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
favicon
          </v-list-group>
        </v-list>
      </v-card>
    </v-flex>
      </v-layout>
    </v-container>

</template>


<script type="text/javascript">
import axios from 'axios'
export default {
  data: ()=>({
    kmlList: [],
  }),
  mounted(){
    var vm = this
    axios({
      method: 'get',
      url: 'http://www.localhost:8080/kml/manage/list',
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(function (response) {
      //handle success
      console.log(response.data)
      vm.kmlList = response.data ;
    })
    .catch(function (response) {
      //handle error
      console.log("error",response);
    });
  },
  methods:{
    newKml(){
      console.log("hello")
    }
  }
}





</script>


<style media="screen">

</style>
