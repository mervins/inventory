<template>
  <v-app style="-webkit-app-region: drag">
    <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    permanent=""
    color="#2C3A47"
    dark
    app
    v-if="temp_json.show_drawer">
      <v-list-item class="px-2 pt-2">
        <v-list-item-avatar>
          <v-img src="./assets/logo.jpg" alt="admin" class="mx-auto"/>
        </v-list-item-avatar>
        <v-list-item-title>Inventory Management</v-list-item-title>
      </v-list-item>
      <v-list shaped class="clickable" >
        <template v-for="item in items">
          <v-list-group v-if="item.children" :key="item.text" v-model="item.model" 
          :prepend-icon="item['icon-ctr']" :append-icon="item.model ? item.icon : item['icon-alt']" active-class="orange--text">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{item.text }}
                </v-list-item-title>
              </v-list-item-content> 
            </template>
            <v-list-item v-for="(child ,i) in item.children" :key="i" route :to="child.route" active-class="orange--text">
              <v-list-item-action v-if="child.icon">
                <v-icon>{{child.icon}}</v-icon>
              </v-list-item-action>
                <v-list-item-content>
                <v-list-item-title>
                   {{child.text}}
                </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
          </v-list-group>
            <v-list-item v-else :key="item.text" active-class="orange--text" route :to="item.route">
              <v-list-item-action>
                <v-icon>{{item.icon}}</v-icon> 
              </v-list-item-action>
               <v-list-item-title>{{item.text}}</v-list-item-title>
            </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="#2C3A47" dark>
      <v-app-bar-nav-icon @click.stop ="mini = !mini" class="clickable"></v-app-bar-nav-icon>
      <v-toolbar-title style="width:300px" class="ml-0 pl-4">
      <span class="hidden-sm-and-down">IDELLE'S</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-on:click="logout" class="clickable" normal>Logout</v-btn>
    </v-app-bar>
    <v-content> 
      <router-view></router-view>
    </v-content> 
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';

import json from "./views/helper/weather.json";

export default {
  name: 'App',
  props:{
    source:String,
  },
  // components: {
  //   HelloWorld,
  // },

  data: () => ({
    temp_json:json,
    drawer: null,
    login:false,
    mini:false,
    fab:false,
    items:[
      {icon: 'mdi-home', text: 'Dashboard', route:'/dashboard'},
      {icon: 'mdi-briefcase-download', text:'Inventory', route:'/inventory',model:false,}, {
        icon: 'mdi-chevron-up', 'icon-alt':'mdi-chevron-down',
        'icon-ctr':'mdi-finance', text:'Stocks', model:false,
        children:[
          {icon:' mdi-plus-box', text:'Stock - In', route:'/stockin'},
          {icon:' mdi-minus-box', text:'Stock - Out', route:'/stockout'}
        ]
      },
      {icon: 'mdi-contrast-circle', text:'Aging', route:'/aging',model:false,}, 
      {icon: 'mdi-account-multiple', text:'Supplier', route:'/supplier',model:false,},
      {icon: 'mdi-account', text:'Customer', route:'/customer',model:false,},
      {icon: 'mdi-file-word-box', text:'Reports', route:'/report',model:false,}, 
      {icon: 'mdi-bus-school', text:'Track', route:'/track',model:false,},
      // {icon: 'mdi-home', text: 'Register', route:'/register'},
      
    ]
  }),
  methods:{
    logout(){
      this.$router.push({
        name: "Login",
      });
      this.temp_json.show_drawer = false;
    }
  }
};
</script>
<style >
.clickable{
  -webkit-app-region:no-drag;
}
</style>


