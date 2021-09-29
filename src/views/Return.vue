<template>
  <div class="stockin">
    <div class="text-center"> 
    <v-card class="d-flex"  flat tile > 
      <h1  class="ml-5 mr-auto item-center">Retrun Product</h1>  
    </v-card> 
  </div>    
  <div class="text-center">
    <v-pagination
      @input="getdata"
      v-model="current_page"
      :length="totalPages.length-1"
      circle
    ></v-pagination>
  </div>
  <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr> 
            <th class="text-left"><h2>Date</h2></th>
            <th class="text-left"><h2>Customer</h2></th>
            <th class="text-left"><h2>Reciever</h2></th>
            <th class="text-left"><h2>Product</h2></th> 
            <th class="text-left"><h2>Quantity</h2></th>  
            <th class="text-left"><h2>Reason</h2></th> 
            <th class="text-left"><h2>Status</h2></th> 
            <th class="text-left"><h2>Action</h2></th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,key) in stockin" :key="key" class="font-weight-regular">
            <td>{{ item.date }}</td>
            <td>{{ item.Track.name }}</td>
            <td>{{ item.Supplier.name }}</td>
            <td>{{ item.total_amount }}</td> 
            <td></td>
            <td></td>
            <td>Pending</td>
            <td> 
                <v-btn depressed route class="mt-1 ml-2 mr-2" color="primary">
                    Retun to inventory
                </v-btn>
                <v-btn depressed route class="mt-1 ml-2 mr-2" color="warning">
                    Loss
                </v-btn>
                <v-btn depressed @click="delete_war(item)" class="mt-1 ml-2 mr-2" color="error">
                Delete
                </v-btn>
            </td> 
          </tr>
        </tbody>
      </template>
  </v-simple-table>  
  <v-row justify="center">
        <v-dialog v-model="dialog.delete" persistent max-width="390"> 
        <v-card>
            <v-card-title class="text-h6">
                Are you sure you want to delete?
            </v-card-title> 
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog.delete = false">
                Disagree
            </v-btn>
            <v-btn color="green darken-1" text @click="deleteTrans()">
                Agree
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-row> 
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
    stockin:[],
    data:{},
    totalPages:[],
    current_page:1,
    temp_json:json,
     page: 1,
  }),
  methods:{ 
       _update_stockout(){  
        axios.put(this.ipaddress+"/api/editstockout", this.selected).then((response) => {
           console.log(response);
           this.toast('Successfully returned!','info'); 
        })
        .catch((error) => {
          console.log("Error in " + error); 
           this.dialog.edit = false;  
        });
    },
      async getdata(){ 
        this.totalPages=[]
        let temp_data =  await axios.get(this.ipaddress+'/api/returns?page='+(this.current_page-1)+'&size=15');
        this.stockin = temp_data.data.rows; 
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
      this.selected = item
    },
    async deleteTrans(){
      let temp_data =  await axios.delete(this.ipaddress+'/api/deletestockin/' +this.selected.id); 
      if(temp_data.data == 'success'){ 
        const data = this.stockin.indexOf(this.selected);
        this.stockin.splice(data,1); 
        this.dialog.delete = false;
        this.toast('Success deleted','error');
      }else{
        this.toast('Something went wrong','error');
      }
      
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
