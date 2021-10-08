<template> 
    <div class="mer_bg">
      <v-container>
        <v-layout row class="text-xs-center" style="margin-top:90px;">
          <v-flex xs4>
            <!-- <v-card height="500px"></v-card> -->
          </v-flex>
          <v-flex xs4 class=" lighten-4"  style="height:400px">
            <v-container
              style="position: relative; top: 2%"
              class="text-xs-center"
            >
            <!-- <center><h1>IDDEL'S</h1></center> -->
              <v-card flat class="pl-2 pr-2 mer_login">
                <div class="mer_center">
                  <div ><h1 class="mer_title">Login Inventory</h1></div>
                </div>
                <div class="osmer-form">
                  <v-form>
                  <v-text-field  name="Username" label="Username" v-model="form.username" :rules='loginRules'></v-text-field>
                  <v-text-field  name="Password" label="Password" type="password" v-model="form.password" :rules='password'></v-text-field>
                  <v-card-actions>
                    <v-btn primary large block @click="login" :disabled="isDisable">Login</v-btn>
                  </v-card-actions>
                </v-form>
                </div>
              </v-card>
            </v-container>
          </v-flex>
          <!-- <v-img src="../../assets/bg.jpg" alt="admin" class="mx-auto"/> -->
        </v-layout>
      </v-container>
    </div> 
</template>
<script>
import axios from 'axios';
// import json from "../helper/weather.json";
import Helper from "../helper/helper.js";
export default {
    emits: ['login_return'],
    mixins:[Helper],
    data:()=>({
        // temp_json:json,
        form:{
          username:"",
          password:""
        },
        data:{},
        loginRules:[v => !!v || "The username is required"],
        password:[v => !!v || "The password is required"]
    }),
    created(){ 
    },
    methods:{
        login(){
               axios.post(this.ipaddress+'/api/login', this.form).then((response)=>{
                     this.data = response; 
                     if(this.data.data === ""){
                     this.toast('Login Failed','error'); 
                     }else if(this.data.data === "incorrect"){
                      this.toast('Server Error','error');
                     }
                     else{
                      localStorage.setItem('isLoggedIn', true);
                      localStorage.setItem('user', JSON.stringify(response.data));
                      this.$parent.isLoggedIn = true
                      this.temp_json = JSON.parse(localStorage.getItem('user'));
                      console.log(this.$parent.isLoggedIn)
                      // var codidtion = true;
                      // this.$emit('login_return', {codidtion});
                      this.toast('Successfully added!','info'); 
                      this.$router.push({
                          name: "Dashboard",
                        }).catch(()=>{});
                      }
                 });
        }
    },
    computed:{
      isDisable(){
        return (this.form.username.length <= 0) || (this.form.password.length <= 0);
      }
    }
};
</script>
<style>

.mer_title{
  color:black; 
  padding:1vmin;
}
.mer_center{
  display: flex;
  align-items: center;
  justify-content: center;
}
.mer_bg{
background: url('../../assets/bg.jpg'); 
  background-repeat: no-repeat;
   background-position: center center;
   background-attachment: fixed;
   background-size: cover;
}
.mer_login{
   background-color: rgba(231, 229, 229, 0.95) !important;
   color: white !important;
}

.mer_bg {
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        /* background-color: rgba(0, 0, 0, 0.3); */
        animation: erl-anim-fade 0.3s;
    }
  .osmer-form{
    padding: 2vmin;
  }
</style>
