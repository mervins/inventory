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
    <v-row>
      <v-dialog v-model="dialog.create" persistent max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">New Product</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <!-- <v-col cols="12" md="4">
                  <v-text-field
                    label="Product ID*"
                    required
                    v-model="form.productid"
                    type="number"
                  ></v-text-field>
                </v-col> -->
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Description*"
                    v-model="form.description"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Price*"
                    persistent-hint
                    type="number"
                    v-model="form.price"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="stock*" 
                    type="number"
                    v-model="form.stock"
                    disabled
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Selling Price*" 
                    persistent-hint
                    required
                    v-model="form.sellingprice"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    :items="['Kilos', 'Bags']"
                    label="Measurement*"
                    v-model="form.measure"
                    required
                  ></v-select>
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
            <th class="text-left"><h2>Product ID</h2></th>
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
            <td>{{ item.product_id }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.measure }}</td>
            <td>{{ item.sellingprice }}</td>
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
                  <v-text-field
                    label="Product ID*"
                    required
                    v-model="select.product_id"
                    disabled
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Description*"
                    v-model="select.description"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" v-if="temp_json.data.type == 'Administrator'">
                  <v-text-field
                    label="Price*"
                    persistent-hint
                    type="number"
                    v-model="select.price"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Stock*" 
                    type="number"
                    v-model="select.stock"
                    disabled
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" v-if="temp_json.data.type == 'Administrator'">
                  <v-text-field
                    label="Selling Price*" 
                    persistent-hint
                    required
                    v-model="select.sellingprice"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    :items="['Kilos', 'Bags']"
                    label="Measurement*"
                    v-model="select.measure"
                    required
                  ></v-select>
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
    <v-row>
      <v-dialog v-model="stock.in" persistent max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">Stock-In</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                 <v-col cols="12" md="4">
                  <v-select :items="track" label="Panel*" required item-text="name" v-model="stockInfo.track_id" item-value="track_id"></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select :items="supplier" label="Supplier*" required item-text="name" v-model="stockInfo.supplier_id" item-value="supplier_id"></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col> 
               <v-row> 
                <v-col cols="12" md="12">
                <br> 
                <h1>ITEMS</h1>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select :items="product" label="Products*" required v-model="stockIn.product_id" item-value="product_id" item-text="description"></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Quantity" 
                    persistent-hint
                    required
                    v-model="stockIn.quantity"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Price" 
                    persistent-hint
                    required
                    v-model="stockIn.price"
                    type="number"
                  ></v-text-field>
                </v-col> 
                 <v-col cols="12" md="12">
                  <div class="d-flex flex-row-reverse"   >
                     <!-- <v-btn  class="pa-2"  color="primary" dark @click="add_stockin" :disabled="true">
                        Add Item
                    </v-btn> -->
                    <v-btn color="primary" @click="add_stockin" :disabled = "addItems">Add Item</v-btn>
                  </div>
                </v-col>
               </v-row> 
              </v-row>
          <v-card>
            <v-simple-table fixed-header :height="stockInData.length > 0 ? '300px' : '100px'">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"><h2>Name</h2></th>
                  <th class="text-left"><h2>Quantity</h2></th>
                  <th class="text-left"><h2>Price</h2></th> 
                  <th class="text-left"><h2>Sub total</h2></th> 
                  <th class="text-left"></th> 
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item,key) in stockInData"
                  :key="key"
                  class="font-weight-regular"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.price }}</td> 
                  <td>{{ item.total }}</td> 
                  <td style="color:red; cursor:pointer" @click="_remove_product(key)">DELETE</td> 
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td><h1>Total Amount</h1></td> 
                  <td>{{ total_amount }}</td> 
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          </v-card>
            </v-container>
          </v-card-text>
          <hr>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close_stock_in_and_out('in')">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="save_stockin" :disabled = 'stockInData.length <= 0'> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-dialog v-model="stock.out" persistent max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">Stock-Out</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                 <v-col cols="12" md="4">
                  <v-select :items="track" label="Panel*" required item-text="name" v-model="stockInfo.track_id" item-value="track_id"></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select :items="customer" label="Customer*" required item-text="name" v-model="stockInfo.customer_id" item-value="customer_id"></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Date Today"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col> 
               <v-row> 
                <v-col cols="12" md="12">
                <br> 
                <h1>ITEMS</h1>
                </v-col>
                <v-col cols="12" md="4">
                     <v-select :items="product" label="Products*" required v-model="stockIn.product_id" item-value="product_id" item-text="description" @change="get_pro"></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Quantity" 
                    persistent-hint
                    required
                    v-model="stockIn.quantity"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Price" 
                    persistent-hint
                    required
                    v-model="stockIn.price"
                    type="number"
                  ></v-text-field>
                </v-col> 
                 <v-col cols="12" md="12">
                  <div class="d-flex flex-row-reverse"   >
                     <v-btn  color="primary" @click="add_stockout" :disabled = 'addStockout'>
                        Add Item
                    </v-btn>
                     <!-- <v-btn color="primary" @click="add_stockin" :disabled = "addItems">Add Item</v-btn> -->
                  </div>
                </v-col>
               </v-row> 
              </v-row>
    <v-card>
      <v-simple-table fixed-header :height="stockInData.length > 0 ? '300px' : '100px'">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"><h2>Name</h2></th>
            <th class="text-left"><h2>Quantity</h2></th>
            <th class="text-left"><h2>Price</h2></th> 
            <th class="text-left"><h2>Sub total</h2></th> 
            <th class="text-left"></th> 
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item,key) in stockInData"
            :key="key"
            class="font-weight-regular"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price }}</td> 
            <td>{{ item.total}}</td> 
            <td style="color:red; cursor:pointer;" @click="_remove_product(key)">DELETE</td> 
          </tr>
          <tr>
                <td></td>
                <td></td>
                <td><h1>Total Amount</h1></td> 
                <td>{{ total_amount }}</td> 
          </tr>
        </tbody>
      </template> 
    </v-simple-table>
    </v-card>
    <br>
     <v-card v-if="total_amount > 0">
        <v-card-title>
            <span class="headline">Payment Method</span>
          </v-card-title>
        <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select :items="['Paid - Full', 'Paid - Partial', 'Unpaid']" label="Cash*" required v-model="payment_method.status"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    :disabled = "payment_method.status === 'Unpaid' ? true : false"
                    label="Amount" 
                    persistent-hint
                    required
                    v-model="payment_method.payment" 
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                </v-col> 
                <h6 style="display:none;">{{payment_method.balance = total_amount-payment_method.payment}}</h6>
                <v-col cols="12" sm="6">
                  <v-text-field 
                    disabled
                    label="Balance" 
                    persistent-hint
                    required
                    v-model="payment_method.balance"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row> 
        </v-container>
        </v-card-text>
        </v-card>
        </v-container>
          </v-card-text>
          <hr>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close_stock_in_and_out('out')">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="save_stockout" :disabled = 'stockInData.length <= 0'> Save </v-btn>
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
  </div>
</template>
<script>
import forEach from "lodash/forEach";
import indexOf from "lodash/indexOf";
import find from "lodash/find";
import Vue from 'vue';
import axios from 'axios';
import Helper from "../views/helper/helper.js";
import json from "./helper/weather.json";
export default {
  mixins:[Helper],
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
    },
    select: {},
    stockIn:{  
      name:"",
      quantity:"",
      price:"",
      total:0, 
      product_id:""
    },
    stockInData:[],
    stockOutData:[], 
    total_amount:0, 
    customer:[],
    supplier:[],
    product:[],
    track:[],
    payment_method:{
      status:'',
      balance:0,
      payment:0
    },
    stockInfo:{
      data:{
        product:{},
        payment_method:{}
      },
      track_id:"",
      supplier_id:"",
      customer_id:""

    }
  }),
  methods: {
     async get_supplier(){ 
        let temp_data =  await axios.get(this.ipaddress+'/api/supplier');
        this.supplier = temp_data.data; 
      },
    set_date(){
      this.stockInfo.date = this.date;
    },
    async get_consumer(){ 
      let temp_data =  await axios.get(this.ipaddress+'/api/customer');
      this.customer = temp_data.data; 
    },
    async get_sub_product(){ 
      let temp_data =  await this.get_product();
      this.product = temp_data.data;  
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
    open_stockin(){
      this.stock.in = true;
    }, 
    _remove_product(index){ 
        this.total_amount = 0;
        this.stockInData.splice(index,1);
        forEach(this.stockInData , (item)=>{
        this.total_amount = item.total + this.total_amount;
      })
    }, 
    assign(data) { 
      return JSON.parse(JSON.stringify(data));
    },
    add_stockin(){
      this.set_date();
      this.total_amount = 0;
      this.stockIn.total = parseInt(this.stockIn.quantity * this.stockIn.price);
      forEach(this.product ,(item) =>{
        if(item.product_id === this.stockIn.product_id){
          this.stockIn.name = item.description; 
        }
      })
      let temp_data = this.assign(this.stockIn)
      this.stockInData.push(temp_data);
      forEach(this.stockInData , (item)=>{
        this.total_amount = item.total + this.total_amount;
      })
      this.stockIn={
            quantity:"",
            price:"",
            total:0, 
            product_id:""
      }
    },
    async save_stockin(){   
          this.stockInfo.total_amount = this.total_amount;
          this.stockInfo.data = JSON.stringify(this.stockInData);
          axios.post(this.ipaddress+"/api/addStockin", this.stockInfo).then((response) => { 
           console.log(response.data); 
            for(var x = 0; x < this.product.length; x++){ 
            for(var y=0; y<this.stockInData.length; y++){
                if(this.product[x].product_id === this.stockInData[y].product_id){ 
                this.product[x].stock = parseInt(this.product[x].stock) + parseInt(this.stockInData[y].quantity); 
                this.update_stock_in_product(this.product[x]);
              }
            }
          } 
          this.stock.in = false; 
          this.toast('Successfully added to stock-in!','info');
        })
        .catch((error) => { 
          this.stock.in = false; 
          console.log("Error in " + error);    
          this.toast('Something went wrong','error'); 
        });
    
    },
    async save_stockout(){
      this.stockInfo.total_amount = this.total_amount;
      this.stockInfo.data.product = (this.stockInData);
      this.stockInfo.data.payment_method = (this.payment_method);
      axios.post(this.ipaddress+"/api/addStockout", this.stockInfo).then((response) => {
      console.log(response.data); 
      for(var x = 0; x < this.product.length; x++){ 
         for(var y=0; y<this.stockInData.length; y++){
            if(this.product[x].product_id === this.stockInData[y].product_id){ 
            this.product[x].stock = parseInt(this.product[x].stock) - parseInt(this.stockInData[y].quantity); 
            this.update_stock_in_product(this.product[x]);
          }
         }
      } 
      this.stock.out = false;
      this.toast('Successfully added to stock-out!','info');
      this.stockInData=[];
      }).catch((error)=>{  
        console.log(error)
        this.toast('Something went wrong','error'); 
        this.stock.out = false;
      });
     
    }, 
    add_stockout(){ 
      this.set_date();
      this.total_amount = 0;
      let stock_availble=0;
      this.stockIn.total = parseInt(this.stockIn.quantity * this.stockIn.price);
      forEach(this.product ,(item) =>{
        if(item.product_id === this.stockIn.product_id){
          this.stockIn.name = item.description; 
          stock_availble = parseInt(item.stock);
        }
      })
      if(stock_availble >= this.stockIn.quantity){
        let temp_data = this.assign(this.stockIn)
        this.stockInData.push(temp_data);
        forEach(this.stockInData , (item)=>{
          this.total_amount = item.total + this.total_amount;
        }) 
        this.stockIn.quantity=''
        this.stockIn.price=''; 
        this.stockIn.total=0
        this.stockIn.product_id = ""
      }else{ 
          this.toast('Insufficient Stock','error');
      }
    },
    async update_stock_in_product(product){  
         axios.put(this.ipaddress+"/api/editProduct", product).then((response) => { 
           console.log(response.data); 
            this.stockInData = [];
            this.stockInfo = {data:{
                              product:{},
                              payment_method:{}
                            }};
            this.total_amount = 0; 
        })
        .catch((error) => {
          console.log("Error in " + error);  
          this.toast('Something went wrong','error'); 
          this.stockInData = [];
          this.stockInfo = {};
          this.total_amount = 0; 
        });
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
    update_balance(){
      this.payment_method.balance = this.total_amount - this.payment_method.payment;
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
    get_pro(){
      console.log('test')
      forEach(this.product,(item)=>{
        if(item.product_id == this.stockIn.product_id){
          this.stockIn.price = item.sellingprice;
        }
      })
    }
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