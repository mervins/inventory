<template>
  <div class="about">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <v-card>
      <v-container >
        <v-row style="margin:90px">
          <v-col cols="12" md="4"  v-if="temp_json.data.type == 'Administrator'">
            <v-card  class="mx-auto buttons" max-width="344" max-height="344" route :to="'/alluser'"> 
                <v-img
                  height="250"
                  src="../assets/user.png"
                ></v-img>
          </v-card>
          </v-col>
          <v-col cols="12" md="4" >
            <v-card  class="mx-auto buttons" max-width="344" max-height="344" route :to="'/inventory'"> 
                <v-img
                  height="250"
                  src="../assets/inventory.png" 
                ></v-img>
          </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card  class="mx-auto buttons" max-width="344" max-height="344" route :to="'/supplier'"> 
                <v-img
                  height="250"
                  src="../assets/supplier.png"
                ></v-img>
          </v-card>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="4" >
            <v-card  class="mx-auto buttons" max-width="344" max-height="344" route :to="'/customer'"> 
                <v-img
                  height="250"
                  src="../assets/cunsomer.png"
                ></v-img>
          </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card  class="mx-auto buttons" max-width="344" max-height="344" route :to="'/report'"> 
                <v-img
                  height="250"
                  src="../assets/report.png" 
                ></v-img>
          </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card  class="mx-auto buttons" max-width="344" max-height="344" route :to="'/aging'"> 
                <v-img
                  height="250"
                  src="../assets/aging.png"
                ></v-img>
          </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>  
  </div>
</template>
<script>
import axios from 'axios';
import json from "./helper/weather.json";
//import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {
    //HelloWorld
  },
  data:()=>({ 
    temp_json:json,
    data:[],
    user:{},
    form:{
      name:'adhkajsdhaksdh',
      password:'ajdgagsdhjas',
      username:'agdshjajhsdg'
    }
  }),
  created(){
    this.getdata();
  },
  methods:{
    async getdata(){ 
    let temp_data =  await axios.get('http://127.0.0.1:3308/api/all');
    this.data = temp_data.data;
    console.log(this.data) 
    },
     add_user(){ 
      let temp_data =  axios.post('http://127.0.0.1:3308/api/new', this.form);
      this.user = temp_data; 
    }
  }
}
</script>
<style>
.buttons{
  cursor: pointer;
  background-color: rgb(105, 155, 179) !important;
}
.buttons:hover{ 
  background-color: rgb(244, 244, 245) !important;
}
.about{
  height: 100%;
  background-color: rgb(243, 243, 245) !important;
}
</style>
