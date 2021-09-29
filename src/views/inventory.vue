<template>
  <div class="inventory">
    <div> 
    <v-card class="d-flex mb-6"  flat tile > 
      <h1  class="ml-5 mr-auto">Inventory</h1> 
      <v-btn  class="pa-2 ma-2 "  color="primary" dark @click="dialog.create=true">
          Add Product
      </v-btn>
      <v-btn  class="pa-2 ma-2"  color="green" dark @click="stock.in=true">
          Stock-IN
      </v-btn>
      <v-btn  class="pa-2 ma-2"  color="red" dark @click="stock.out=true">
          Stock-OUT
      </v-btn> 
      
    </v-card>
  </div>
    <div class="text-center">
    <v-pagination
      @input="get_sub_product"
      v-model="current_page"
      :length="totalPages.length-1"
      circle
    ></v-pagination>
  </div>   
    <v-row>
      <v-dialog v-model="dialog.create" persistent max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">New Product</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row> 
                <v-col cols="12" md="4">
                  <v-text-field label="Description*" v-model="form.description" ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="Price*" persistent-hint type="number" v-model="form.price" required ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field label="stock*" type="number" v-model="form.stock" disabled required></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field label="Selling Price*" persistent-hint required v-model="form.sellingprice" type="number"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <!-- <v-select :items="['Kilos', 'Bags']" label="Measurement*" v-model="form.measure" required></v-select> -->
                  <v-text-field label="Unint (kilos, Bag, pcs)" persistent-hint required v-model="form.measure" ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4"> 
                  <v-text-field label="Alert" persistent-hint required v-model="form.min" type="number"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog.create = false">
              Close
            </v-btn>
            <v-btn primary color="blue darken-1" text @click="add_product" :disabled = "isDisable">
              Save 
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row> 
    <hr />
    <v-simple-table fixed-header height="500px">
      <template v-slot:default>
        <thead>
          <tr>
            <!-- <th class="text-left"><h2>Product ID</h2></th> -->
            <th class="text-left"><h2>Description</h2></th>
            <th class="text-left"><h2>Price</h2></th>
            <th class="text-left"><h2>Stock</h2></th>
            <th class="text-left"><h2>Measure</h2></th>
            <th class="text-left"><h2>Selling Price</h2></th>
            <th class="text-left"><h2>Actions</h2></th> 
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in product"
            :key="item.name"
            class="font-weight-regular"
          >
            <!-- <td>{{ item.product_id }}</td> -->
            <td><h2>{{ item.description }}</h2></td>
            <td><h3>{{ item.price }}</h3></td>
            <td>
              <h3 v-if="parseInt(item.min) >= parseInt(item.stock)" class="red--text">{{ item.stock }}</h3>
              <h3 v-else>{{ item.stock }}</h3>
            </td>
            <td><h3>{{ item.measure }}</h3></td>
            <td><h3>{{ item.sellingprice }}</h3></td>
            <td> 
              <v-btn dark small color="cyan" @click="open_edit(item)">
                Edit
              </v-btn>
              <v-btn class="mx-2" dark small color="red" @click="delete_war(item)" v-if="temp_json.data.type == 'Administrator'">
                Delete
              </v-btn> 
            </td> 
          </tr>
        </tbody>
      </template>
    </v-simple-table> 

     <v-row>
      <v-dialog v-model="dialog.edit" persistent max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">Modified Product</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field label="Product ID*" required v-model="select.product_id" disabled type="text" ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="Description*" v-model="select.description" ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" v-if="temp_json.data.type == 'Administrator'">
                  <v-text-field label="Price*" persistent-hint type="number" v-model="select.price" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field label="Stock*"  type="number" v-model="select.stock" disabled required></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" v-if="temp_json.data.type == 'Administrator'">
                  <v-text-field label="Selling Price*" persistent-hint required v-model="select.sellingprice" type="number"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field label="Selling Price*" persistent-hint required v-model="select.measure"></v-text-field>
                    </v-col>
                  <v-col cols="12" sm="4"> 
                    <v-text-field label="Alert" persistent-hint required v-model="select.min"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog.edit = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="save_edit"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
 
   
    <v-row justify="center">
      <v-dialog
        v-model="dialog.delete"
        persistent
        max-width="390"
      > 
        <v-card>
          <v-card-title class="headline">
            Are you sure you want to delete this product?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog.delete = false"
            >
              Disagree
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="delete_product()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <StockIn v-if ="stock.in" :stock="stock.in" :supplier="supplier" :product="product" :track="track"></StockIn>
    <StockOut v-if ="stock.out" :stock="stock.out" :customer="customer" :product="product" :track="track"></StockOut>
  </div>
</template>
<script> 
import indexOf from "lodash/indexOf";
import find from "lodash/find";
import Vue from 'vue';
import axios from 'axios';
import Helper from "../views/helper/helper.js";
import json from "./helper/weather.json";
import StockIn from "./inventory/stockIn.vue";
import StockOut from "./inventory/stockout.vue";
export default {
  mixins:[Helper],
  components:{
    StockIn,
    StockOut
  },
  data: () => ({ 
    temp_json:json,
    dialog: {
      create: false,
      edit: false,
      delete: false,
    },
    stock:{
      in:false,
      out:false
    },
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    form: {
      description: "",
      price: "",
      stock: 0,
      measure: "",
      sellingprice: "", 
      min:10
    },
    select: {}, 
    total_amount:0, 
    customer:[],
    supplier:[],
    product:[],
    track:[], 
    stockInfo:{
      data:{
        product:{},
        payment_method:{}
      },
      track_id:"",
      supplier_id:"",
      customer_id:"" 
    },
    totalPages:[],
    current_page:1
  }),
  methods: {
     async get_supplier(){ 
        let temp_data =  await axios.get(this.ipaddress+'/api/supplier');
        this.supplier = temp_data.data; 
      }, 
    async get_consumer(){ 
      let temp_data =  await axios.get(this.ipaddress+'/api/customer');
      this.customer = temp_data.data; 
    },
    async get_sub_product(){   
      let temp_data =  await axios.get(this.ipaddress+'/api/productPG?page='+(this.current_page-1)+'&size=20');
      this.product = temp_data.data.rows; 
      this.totalPages=[];  
      let data_temp = temp_data.data; 
      for(let x = 0; x <= data_temp.totalPages; x++){
          this.totalPages.push(x);
      }  
    },
     async get_track(){ 
      let temp_data =  await axios.get(this.ipaddress+'/api/track');
      this.track = temp_data.data; 
      
    },
    async add_product(){ 
        let temp_data = await axios.post(this.ipaddress+'/api/addProduct', this.form);
        console.log(temp_data.data);
        await this.product.push(temp_data.data); 
        this.dialog.create = false;
        this.toast('Successfully added!','info'); 
      },
    open_edit(item) {
      this.dialog.edit = true;
      this.select = this.assign(item);
      //this.select = this.assign(item);
    }, 
    assign(data) { 
      return JSON.parse(JSON.stringify(data));
    },   
 
    close_stock_in_and_out(status){
      if(status === 'in'){
        this.stock.in = false;
      }else{
        this.stock.out = false; 
      }
      this.total_amount = 0;
      this.stockIn.product_id='';
      this.stockIn.name='';
      this.stockIn.quantity=''
      this.stockIn.price=''; 
      this.stockIn.total=0;
      this.stockInData = [];
      this.stockOutData = [];
    }, 
    delete_war(item){
      this.dialog.delete = true;
      this.select = this.assign(item)
    },
    delete_product(){ 
      axios.delete(this.ipaddress+"/api/deleteProduct/" + this.select.id).then((response) => {
          console.log(response)
          this.product.splice(indexOf(this.product,
              find(this.product, (x) => {
                return x.id === this.select.id;
              })
            ),
            1
          ); 
          this.dialog.delete = false;
          this.toast('Successfully deleted','error');
        })
        .catch((error) => {
          console.log("Error in " + error);  
          this.toast('Something went wrong!','error');
        });
    },
    save_edit(){  
      axios.put(this.ipaddress+"/api/editProduct", this.select).then((response) => {  
          Vue.set(
            this.product,
            indexOf(
              this.product,
              find(this.product, (x) => {  
                return x.product_id == this.select.product_id;
              })
            ),
            this.select
          );
           this.dialog.edit = false;  
           console.log(response.data); 
          this.toast('Successfully updated!','info'); 
        })
        .catch((error) => { 
          console.log("Error in " + error); 
           this.dialog.edit = false;
        });
    }, 
  },
  created(){
    let loader = this.$loading.show({loader: "bars",color: 'rgb(0,123,255)',backgroundColor: '#ffffff',width: 128,height: 128,});
    this.get_consumer();
    this.get_supplier();
    this.get_sub_product();
    this.get_track();
    loader.hide();
              

  },
  computed:{
    isDisable(){    
        return (this.form.description.length <= 0) || (this.form.price.length <= 0) || (this.form.measure.length <= 0) || (this.form.sellingprice.length <= 0);
      },
    addItems(){ 
      return (this.stockIn.product_id.length <= 0) || (this.stockIn.price.length <= 0) || (this.stockIn.quantity.length <= 0) || (this.stockInfo.supplier_id <= 0) || (this.stockInfo.track_id <= 0) ;
    },
     addStockout(){ 
      return (this.stockIn.product_id.length <= 0) || (this.stockIn.price.length <= 0) || (this.stockIn.quantity.length <= 0);
    }
  }
};
</script>
<style>
.sub_main {
  margin: 3px;
}
.taes {
  font-size-adjust: 50px;
}
.inventory{
  height: 100%;
  background: white;
}
</style>