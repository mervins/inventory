<template>
  <div class="stockout">
    <div> 
    <v-card class="d-flex"  flat tile > 
      <h1  class="ml-5 mr-auto item-center">Stock-Out</h1>   
      <!-- <v-row class="ml-3">
        <v-col cols="12" md="3">
            <v-select :items="totalPages" label="Stock per Page" outlined v-model="current_page" @change="getdata">
            </v-select>
        </v-col> 
      </v-row>  -->
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
            <th class="text-left"><h2>Panel Name</h2></th>
            <th class="text-left"><h2>Customer Name</h2></th>
            <th class="text-left"><h2>Total Amount</h2></th> 
            <th class="text-left"><h2>Action</h2></th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,key) in stockout" :key="key" class="font-weight-regular">
            <td>{{ item.date }}</td>
            <td>{{ item.Track.name }}</td>
            <td>{{ item.Customer.name }}</td>
            <td>{{ item.total_amount }}</td> 
            <td> 
              <v-btn depressed route :to="{name: 'Stockoutview', params: {stockout_id: item.stockout_id}}" class="mt-1 ml-2 mr-2" color="primary">
                Open
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
import Helper from "../views/helper/helper.js"
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
    current_page:1
  }),
  methods:{ 
      async getdata(){ 
        let temp_data =  await axios.get(this.ipaddress+'/api/stockout?page='+(this.current_page-1)+'&size=15');
        this.stockout = temp_data.data.rows; 
        this.totalPages=[];  
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
      let temp_data =  await axios.delete(this.ipaddress+'/api/deletestockout/' +this.selected.id); 
      if(temp_data.data == 'success'){ 
        const data = this.stockout.indexOf(this.selected);
        this.stockout.splice(data,1); 
        this.dialog.delete = false;
        this.toast('Success deleted','error');
      }else{
        this.toast('Something went wrong','error');
      }
      
    },
  },
  created(){ 
    this.getdata()  
  }
};
</script>
<style lang="css">
.stockout{
    height: 100%;
    background: white;
}
.v-application .d-flex {
    display: flex !important;
    align-items: center;
    align-content: center;
}
</style>