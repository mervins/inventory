<template>
    <div class="cat pa-md-4">
        <v-card> 
            <div> 
                <v-card class="d-flex"  flat tile > 
                    <h2  class="ml-5 mr-auto mt-2">Order Management</h2> 
                    <!-- <v-btn  class="pa-2 ma-2 pl-2 pr-2"  color="warning" rounded @click="modal.add=true">
                        Add Product
                    </v-btn>  -->
                </v-card>
            </div>
            <hr> 
            <v-row>
                <v-col cols="12" md="4">
                    <v-card class="pa-md-2 ma-2">
                        <div><h3>Table Status</h3></div>
                        <div>
                            <div v-for="table in tables" :key="table.name">
                                <v-card class="pa-3 mb-2">
                                    <div class="d-flex justify-space-between mb-1">
                                        <h4>{{table.capacity}} Persons</h4> 
                                        <h4 :class="table.status == '1' ? 'primary--text' : 'error--text'">{{table.status == '1' ? 'Vacant' : 'Occupied'}}</h4></div>
                                    <p class="text-h5 text--primary">{{table.name}}</p>
                                   <div class="d-flex flex-row-reverse">   
                                        <v-btn  class="pa-2 ma-1 pl-6 pr-6"  color="warning" rounded :disabled="table.status == '1' ? false : true" @click="tableInfo(table)">
                                            Order
                                        </v-btn>  
                                        <v-btn  class="pa-2 ma-1 pl-7 pr-7"  color="primary" rounded @click="modal.add=true" :disabled="table.status == '2' ? false : true">
                                            View
                                        </v-btn> 
                                   </div>
                                </v-card>
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="12" md="8">
                    <v-card class="pa-md-2 ma-2"> 
                         <h3>Order Status</h3>
                        <v-simple-table>
                            <template v-slot:default> 
                            <thead>
                                <tr>
                                <th class="text-left">
                                    <h3>Item Name</h3>
                                </th>
                                <th class="text-left">
                                    <h3>Quantity</h3>
                                </th>
                                <th class="text-left">
                                    <h3>Rate</h3>
                                </th>
                                <th class="text-left">
                                    <h3>Amount</h3>
                                </th>
                                <th class="text-left">
                                    <h3>Action</h3>
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- <tr v-for="item in data" :key="item.name" >
                                <td>{{ item.name }}</td>
                                <td>{{ item.calories }}</td>
                                </tr> -->
                            </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
        <v-dialog  max-width="500"  v-model="modal.add" persistent> 
            <template>
            <v-card>
                <v-toolbar color="primary" dark >Order</v-toolbar>
                <v-card-text>
                    <div class="pt-5">
                        Category
                        <v-select :items="cats" item-text="name" item-value="cat_id"  label="Category" solo @input="checkCat(data.cat)" v-model="data.cat"></v-select>
                    </div>
                    <div>
                        Menu
                       <v-select :items="list_menus" item-text="name" label="Menu" solo v-model="data.menu"></v-select>
                    </div> 
                    <div>
                        <v-text-field label="Quantity" outlined clearable type="number" v-model="data.quantity"></v-text-field>
                    </div> 
                </v-card-text>
                <v-card-actions class="justify-end">
                <v-btn text  @click="modal.add = false">Cancel</v-btn>
                <v-btn  class="pl-7 pr-7"  color="warning" rounded >
                        Order
                    </v-btn>
                </v-card-actions>
            </v-card>
            </template>
        </v-dialog>
      
    </div>
    
</template>
<script>
import Helper from "../helper/helper.js"
import axios from 'axios'; 
// import Vue from "vue"; 
// import indexOf from "lodash/indexOf";
// import find from "lodash/find";
export default ({
    mixins:[Helper],
    data:()=>({
        headers:["Category Name","Status","Action"],
        modal:{
            add:false
        },
        tables:[],
        menus:[],
        cats:[],
        form:{},
        list_menus:[],
        data:{}
    }),
    created(){
        this.initialize();
    },
    methods:{
        tableInfo(item){
            this.form.table_name = item.name;
            this.form.table_id = item.id;
            this.modal.add = true;
            
        },
        async initialize(){
            try{
                let table =  await axios.get(this.ipaddress+'/api/table');
                this.tables = table.data;
                let menu =  await axios.get(this.ipaddress+'/api/menu');
                this.menus = menu.data;
                let cat =  await axios.get(this.ipaddress+'/api/category');
                this.cats = cat.data;
                console.log(fetch);
            }catch(e){
                 console.log(e);
            } 
        },
        checkCat(id){
           this.list_menus =  this.menus.filter((v) => {
              return v.cat_id == id
          });
          console.log(this.list_menus);
        },
          
    },
})
</script>
<style scoped>
.cat{
  height: 100%;
  background: white;
} 
</style>
