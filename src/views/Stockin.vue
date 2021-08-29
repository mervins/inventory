<template>
  <div class="stockin">
    <div> 
    <v-card class="d-flex"  flat tile > 
      <h1  class="ml-5 mr-auto item-center">Stock-In</h1> 
      <v-row class="ml-3">
        <v-col cols="12" md="3">
            <v-select :items="totalPages" label="Stock per Page" outlined v-model="current_page" @change="getdata">
            </v-select>
        </v-col> 
      </v-row>   
    </v-card> 
  </div>    
  <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr> 
            <th class="text-left"><h2>Date</h2></th>
            <th class="text-left"><h2>Panel Name</h2></th>
            <th class="text-left"><h2>Supplier Name</h2></th>
            <th class="text-left"><h2>Total Amount</h2></th> 
            <th class="text-left"><h2>Action</h2></th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,key) in stockout" :key="key" class="font-weight-regular">
            <td>{{ item.date }}</td>
            <td>{{ item.Track.name }}</td>
            <td>{{ item.Supplier.name }}</td>
            <td>{{ item.total_amount }}</td> 
            <td> 
              <v-btn depressed route :to="{name: 'Stockinview', params: {stockin_id: item.stockin_id}}" class="mt-1 ml-2 mr-2">
              Open
            </v-btn>
            </td> 
          </tr>
        </tbody>
      </template>
    </v-simple-table>  
  </div>
</template>
  <script>
import axios from 'axios';
// import indexOf from "lodash/indexOf";
// import find from "lodash/find";
// import Vue from 'vue';
import Helper from "../views/helper/helper.js";
import json from "../views/helper/weather.json";
export default {
  mixins:[Helper],
  data: () => ({
    dialog:{
      create: false,
      edit:false,
      delete:false
    },
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    form:{
        name:'',
        address:'',
        contact:'', 
    },
    selected:{},
    stockout:[],
    data:{},
    totalPages:[],
    current_page:0,
    temp_json:json
  }),
  methods:{ 
      async getdata(){ 
        let temp_data =  await axios.get(this.ipaddress+'/api/stockin?page='+this.current_page+'&size=10');
        this.stockout = temp_data.data.rows; 
        console.log(temp_data.data)
        let data_temp = temp_data.data; 
        for(let x = 0; x <= data_temp.totalPages; x++){
            this.totalPages.push(x);
        }  
      },     
    _open_edit(item){
      this.dialog.edit = true;
      this.selected = this.assign(item)
    },
    
    assign(data) { 
      return JSON.parse(JSON.stringify(data));
    },
    delete_war(item){
      this.dialog.delete = true;
      this.selected = this.assign(item)
    },
  },
  created(){
    // let temp_data =  axios.get('http://127.0.0.1:3308/api/customer');
    this.getdata();
    console.log(this.temp_json) 
  }
};
</script>
<style>
.stockin{
    height: 100%;
    background: white;
}
.v-application .d-flex {
    display: flex !important;
    align-items: center;
    align-content: center;
}
</style>
