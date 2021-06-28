<template>
  <div class="stockout">
    <div> 
    <v-card class="d-flex mb-6"  flat tile > 
      <h1  class="ml-5 mr-auto">Stock-Out</h1>   
    </v-card>
    <v-row class="ml-3">
        <v-col cols="12" md="3">
            <v-select
                :items="totalPages"
                label="Stock per Page" 
                outlined v-model="current_page" @change="getdata">
            </v-select>
        </v-col>
        <!-- <v-col cols="12" md="3">
            
        </v-col> -->
    </v-row> 
  </div>    
    <div class="row ml-2 mr-2">
      <div class="col-md-3 mt-1" v-for="(item,key) in stockout" :key="key">
        <div class="boxProjectList">
          <div class="dot float-right"></div>
          <div class="content">
            <h2><b>Quick Summary</b> <i class="fa fa-clipboard"></i></h2> 
          </div>
          <div class="pa-2" style="border-style: groove;">
            <p>Panel Name: {{item.Track.name}}</p>
            <p>Customer Name: {{item.Customer.name}}</p>
            <p>Total Amount: <b>P {{item.total_amount}}</b></p> 
            <h4>
            <div>
              <v-menu ref="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field  v-model="item.date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="item.date" no-title scrollable> 
                </v-date-picker>
              </v-menu>
            </div>  
            </h4>
          </div>  
            <v-btn depressed route :to="{name: 'Stockoutview', params: {stockout_id: item.stockout_id}}" color="ml-2 mr-2 mt-1">
              Open
            </v-btn> 
          
          <br>
        </div>
      </div>
    </div>
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
    current_page:0
  }),
  methods:{ 
      async getdata(){ 
        let temp_data =  await axios.get(this.ipaddress+'/api/stockout?page='+this.current_page+'&size=10');
        this.stockout = temp_data.data.rows;  
        console.log(temp_data.data);
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
    this.getdata()  
  }
};
</script>
<style lang="css">
.stockout{
    height: 100%;
  background: white;
}
.boxProjectList {
  position: relative;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  height: 325px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  color: black;
}
.modal-backdrop {
  opacity: 0.5 !important;
}

.footer {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
}

.footer > .row > .col1,
.footer > .row > .col2,
.footer > .row > .col3 {
  transition: 0.5s;
  height: 40px;
  font-size: 20px;
  font-weight: 300;
  margin: 1px;
  cursor: pointer;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

.footer > .row > .col1 {
  margin: 2px;
  background-image: linear-gradient(
    to bottom,
    rgb(28, 120, 226) 49.5%,
    rgba(133, 123, 123, 0.2) 50%
  );
  background-size: 200% 200%;
  background-position: bottom; 
}

.footer > .row > .col2 {
  margin: 2px;
  background-image: linear-gradient(
    to bottom,
    rgb(31, 207, 75) 49.5%,
    rgba(133, 123, 123, 0.2) 50%
  );
  background-size: 200% 200%;
  background-position: bottom;
}

.footer > .row > .col3 {
  background-image: linear-gradient(
    to bottom,
    red 49.5%,
    rgba(133, 123, 123, 0.2) 50%
  );
  background-size: 200% 200%;
  background-position: bottom;
}

.footer > .row > .col1:hover {
  font-size: 23px;
  font-weight: 550; 
  color: white;
  background-position: top;
}

.btn-footer:hover{
  color: white;
  background-position: top;
}

.footer > .row > .col2:hover {
  font-size: 23px;
  font-weight: 550; 
  color: white;
  background-position: top;
}

.footer > .row > .col3:hover {
  font-size: 23px;
  font-weight: 550; 
  color: white;
  background-position: top;
}
</style>