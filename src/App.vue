<template>
  <div style="bg">
    <Drawer v-if="isLoggedIn"></Drawer>
    <Login :login_return="login_return" v-else ></Login>
  </div>
</template>

<script>
import Login from "./views/login/login.vue";
import Drawer from "./views/Drawer/Drawer.vue"; 
export default {
  name: 'App',
  props:{
    source:String,
  },
  components: { 
    Drawer,
    Login
  },
    data(){
      return {
        isLoggedIn:false, 
      };
  }, 
  created(){
    var temp = localStorage.getItem('isLoggedIn');
    if(temp== 'true'){
        this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
     
  },
 
  
  methods:{
       login_return(data){
         this.isLoggedIn = data.codidtion;
         alert(this.isLoggedIn);
        }
  }
};
</script>
<style >
.bg{
background: url('./assets/bg.jpg'); 
  background-repeat: no-repeat;
   background-position: center center;
   background-attachment: fixed;
   background-size: cover;
}

.clickable{
  -webkit-app-region:no-drag;
}

.dn-header {
        position: fixed;
        top: 0px;
        left: 240px;
        right: 0px;
        height: 56px; 
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        flex-direction: row;
        z-index: 999;
        transition: all 0.2s;
        transform: translateZ(0px);
    }
    
</style>


