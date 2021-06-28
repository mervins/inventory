<template>
  <div id="app">
    <v-container>
      <v-layout row class="text-xs-center" style="margin-top:50px;">
        <v-flex xs4>
          <!-- <v-card height="500px"></v-card> -->
        </v-flex>
        <v-flex xs4 class="grey lighten-4"  style="height:530px">
          <v-container
            style="position: relative; top: 2%"
            class="text-xs-center"
          >
          <center><h1>IDDEL'S</h1>  <h3>Registration</h3></center>
            <v-card flat class="pl-2 pr-2 pt-2">
              <v-form ref="form">
                <v-text-field 
                  v-model="form.name"
                  label="Name"
                ></v-text-field>
                <v-text-field 
                  v-model="form.username"
                  label="Username"
                ></v-text-field>
                <v-text-field 
                  v-model="form.password"
                  label="Password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  v-model="confirm"
                  label="Confirm Password"
                  type="password"
                ></v-text-field>
                <v-select
                    :items="['User', 'Administrator']"
                    label="Type*"
                    v-model="form.type"
                    required
                  ></v-select>
                <v-card-actions>
                  <v-btn primary large block @click="login" :disabled="isDisable">Register</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import axios from 'axios';
import json from "../helper/weather.json";
import Helper from "../helper/helper.js";
export default {
    mixins:[Helper],
    data:()=>({
        temp_json:json,
        form:{
            name:"",
            type:"",
            username:"",
            password:"1"
        },
        confirm:"0"
    }),
    created(){
        
    },
    methods:{
        login(){ 
          this.$refs.form.validate();
            if(this.confirm === this.form.password){
                 axios.post(this.ipaddress+'/api/newuser', this.form).then((response)=>{
                     console.log(response);
                     this.toast('Successfully added!','info'); 
                 });
            }else{
                this.toast('Please add user','error'); 
            }
        }
    },
    computed:{
      isDisable(){    
        return (this.form.name.length <= 0) || (this.form.type.length <= 0) || (this.form.username.length <= 0) || (this.form.password.length <= 0);
      },
    }
};
</script>
