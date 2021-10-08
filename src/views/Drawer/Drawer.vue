<template>
  <v-app style="-webkit-app-region: drag">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent="" :color="status == 'inventory' ? '#2C3A47' : '#110b39'" dark app> 
      <v-list-item class="px-2 pt-2">
        <v-list-item-avatar>
          <v-img src="../../assets/logo.jpg" alt="admin" class="mx-auto"/>
        </v-list-item-avatar>
        <v-list-item-title>{{status =='inventory' ? 'Inventory' : 'Restaurant'}} Management</v-list-item-title>
      </v-list-item>
      <v-list shaped class="clickable" > 
        <template v-for="item in data(status)">
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
    <HeaderAccountPopup :username="user.name" ref="haPopRef" @logout="logout" @statusCode="statusCode"></HeaderAccountPopup>
    <v-app-bar app :color="status == 'inventory' ? '#2C3A47' : '#110b39'" dark class=".dn-header">
      <v-app-bar-nav-icon @click.stop ="mini = !mini" class="clickable"></v-app-bar-nav-icon>
      <v-toolbar-title style="width:300px" class="ml-0 pl-4">
      <span class="hidden-sm-and-down">IDELLE'S</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div> 
          <v-btn v-on:click="showAhPop" class="ma-2" outlined color="white">{{user.name}}</v-btn>  
      </div>
      <!-- <div v-else>
        <v-btn v-on:click="logout" class="clickable" normal>Login</v-btn>
      </div> -->
      
    </v-app-bar>
    <v-content> 
      <router-view></router-view>
    </v-content> 
  </v-app>
</template>

<script> 
import HeaderAccountPopup from "../../components/HeaderAccountPopup/HeaderAccountPopup.vue" 
import Helper from "../helper/helper.js";
export default {
    name: 'Drawer',
    mixins:[Helper],
  props:{
    source:String,
  },
  components: {
    // HelloWorld,
     HeaderAccountPopup
  },
  data: () => ({ 
    status:'cashier', 
    // isLoggedIn:null, 
    drawer: null,
    login:false,
    mini:false,
    fab:false,
    items:[
      {icon: 'mdi-home', text: 'Dashboard', route:'/dashboard' ,type:'inventory'},
      {icon: 'mdi-briefcase-download', text:'Inventory', route:'/inventory',model:false, type:'inventory'}, {
        icon: 'mdi-chevron-up', 'icon-alt':'mdi-chevron-down',
        'icon-ctr':'mdi-finance', text:'Transaction', model:false,type:'inventory',
        children:[
          {icon:' mdi-plus-box', text:'Stock - In', route:'/stockin',type:'inventory'},
          {icon:' mdi-minus-box', text:'Stock - Out', route:'/stockout',type:'inventory'},
          // {icon:' mdi-keyboard-return', text:'Return', route:'/return'}
        ]
      },
      {icon: 'mdi-contrast-circle', text:'Aging', route:'/aging',model:false, type:'inventory'}, 
      {icon: 'mdi-account-multiple', text:'Supplier', route:'/supplier',model:false,type:'inventory'},
      {icon: 'mdi-account', text:'Customer', route:'/customer',model:false,type:'inventory'},
      {icon: 'mdi-file-word-box', text:'Reports', route:'/report',model:false,type:'inventory'}, 
      {icon: 'mdi-bus-school', text:'Track', route:'/track',model:false,type:'inventory'},
    //   {icon: 'mdi-account', text:'User', route:'/alluser',model:false,type:'inventory'},
      
      // {icon: 'mdi-home', text: 'Dashboard', route:'/dashboard' ,type:'cashier'},
      {icon: 'mdi-sort-variant', text: 'Category', route:'/category',type:'cashier'},
      {icon: 'mdi-table', text: 'Table', route:'/table',type:'cashier'},
      {icon: 'mdi-food-fork-drink', text: 'Product', route:'/product',type:'cashier'},
      {icon: 'mdi-tooltip-edit', text: 'Order', route:'/order',type:'cashier'},
      {icon: 'mdi-content-paste', text: 'Billing', route:'/billing',type:'cashier'},
      
    ]
  }),
  created(){
    // console.log(localStorage.getItem('isLoggedIn'))
    // this.isLoggedIn = localStorage.getItem('isLoggedIn'); 
  }, 
  
  methods:{
    logout(){ 
      localStorage.setItem('isLoggedIn', false);
      this.$parent.isLoggedIn = false
      localStorage.removeItem('user');
    //   this.$router.push({
    //     name: "Login",
    //   });
      // this.temp_json.show_drawer = false;
    },
    showAhPop(){
        this.$refs['haPopRef'].show();
    },
    data(type) {
          return this.items.filter((v) => {
              return v.type == type
          })
      },
    statusCode(data){
      console.log(data.stats)
      this.status = data.stats;
      if(this.status == 'inventory'){
          this.$router.push({
                          name: "Dashboard",
                        }).catch(()=>{});
      }else{
          this.$router.push({
                          name: "Category",
                        }).catch(()=>{});
      }
    }
  }
};
</script>
<style >
.clickable{
  -webkit-app-region:no-drag;
}

.dn-header {
        position: fixed;
        top: 0px;
        left: 240px;
        right: 0px;
        height: 56px;
        background-color: #FFF;
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        flex-direction: row;
        z-index: 999;
        transition: all 0.2s;
        transform: translateZ(0px);
    }
</style>


