<template lang="html">
  <v-container>

    <v-layout align-center justify-center fill-height>
      <v-flex xs12 lg2 >
        <v-text-field label="New KML" placeholder="name" id="kmlName" v-model="kmlName"></v-text-field>
      </v-flex>
      <v-flex xs12 lg6>
        <v-btn block dark @click="newKml()">NEW KML</v-btn>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center fill-height>
      <v-flex lg5>
        <h2 class="sectionTitle">Add Placemark</h2>
      </v-flex>
    </v-layout>
      <v-form>
      <v-layout row wrap align-center justify-space-around>
        <v-flex xs6 md5 lg1>
          <v-text-field label="id" solo v-model="placemark.id"></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="name" solo v-model="placemark.name"></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="Longitude" solo v-model="placemark.longitude"></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="Latitude" solo v-model="placemark.latitude"></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="Range" solo v-model="placemark.range"></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="Altitude Mode" solo v-model="placemark.altitudeMode"> </v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="Description" solo v-model="placemark.description"> </v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="Icon Link" solo v-model="placemark.icon"> </v-text-field>
        </v-flex>
        <v-flex xs12 md12 lg6>
          <v-btn block dark @click="addPlacemark()">ADD PLACEMARK</v-btn>
        </v-flex>

      </v-layout>

    </v-form>

    <v-layout align-center justify-center fill-height>
      <v-flex lg5>
        <h2 class="sectionTitle">Add Photo</h2>
      </v-flex>
    </v-layout>
      <v-form>
      <v-layout row wrap align-center justify-space-around>
        <v-flex xs6 md5 lg1>
          <v-text-field v-model="photo.north" label="North" solo></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field v-model="photo.south" label="south" solo ></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field v-model="photo.east" label="east" solo ></v-text-field>
        </v-flex>
        <v-flex xs6 md5 lg1>
          <v-text-field label="west" solo v-model="photo.west"  ></v-text-field>
        </v-flex>

        <v-flex xs12 md12 lg12>
            <input type="file" ref="file" accept="image/*">
        </v-flex>
        <v-flex xs12 md12 lg6>
          <v-btn  block dark class="imageInput" @click="addPhoto()">ADD PHOTO</v-btn>
        </v-flex>


      </v-layout>

    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data:() => ({
    placemark: {},
    photo:{},
    kmlName: "",
  }),
  methods: {
    newKml(){
      var vm = this
      var bodyFormData = new FormData()
      bodyFormData.append('name',vm.kmlName);
      axios({
        method: 'post',
        url: 'http://www.localhost:8080/kml/manage/new',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log("error",response);
      });
    },
    addPlacemark(){
      var vm = this
      var bodyFormData = new FormData()
      Object.keys(vm.placemark).forEach(function(key){
        bodyFormData.append(key,vm.placemark[key]);
      })
      axios({
        method: 'post',
        url: 'http://www.localhost:8080/kml/builder/addplacemark',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log("error",response);
      });
    },
    addPhoto(){
      var vm = this
      var bodyFormData = new FormData()
      Object.keys(vm.photo).forEach(function(key){
        bodyFormData.append(key,vm.photo[key]);
        console.log(key)
      })
      bodyFormData.append('image',this.$refs.file.files[0])
      axios({
        method: 'post',
        url: 'http://www.localhost:8080/kml/builder/addPhoto',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log("error",response);
      });
    }
  }
}
</script>

<style lang="css" scoped>
.sectionTitle{
  text-align: center;
  margin: 40px;
  font-size: 30px;

}

</style>
