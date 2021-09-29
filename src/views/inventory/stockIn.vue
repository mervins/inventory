<template>
    <div>
        <v-row>
            <v-dialog v-model="stock" persistent max-width="2000px" style="height:100%">
            <v-card>
                <v-card-title>
                <span class="headline">Stock-In</span>
                </v-card-title>
                <v-card-text>  
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-card class="pa-md-4"> 
                                 <v-card-title>
                                    <span class="headline"><h4>SUPPLIER</h4></span>
                                </v-card-title>
                                <v-select :items="track" label="Panel*" required item-text="name" v-model="stockInfo.track_id" item-value="track_id"></v-select>
                                <v-select :items="supplier" label="Supplier*" required item-text="name" v-model="stockInfo.supplier_id" item-value="supplier_id"></v-select>
                                <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="date" label="Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="modal = false">
                                        Cancel
                                        </v-btn>
                                        <v-btn  text color="primary" @click="$refs.dialog.save(date)" >
                                        OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                             
                                     
                            </v-card>
                            
                        </v-col>
                        <v-col cols="12" md="8">
                            <v-row> 
                                <v-col cols="12" md="12"> 
                                <h1>ITEMS</h1>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select :items="product" label="Products*" required v-model="stockIn.product_id" item-value="product_id" item-text="description"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-text-field label="Quantity"  persistent-hint required v-model="stockIn.quantity" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-text-field label="Price" persistent-hint required v-model="stockIn.price" type="number"></v-text-field>
                                </v-col> 
                                <v-col cols="12" md="8">
                                    <div class="d-flex flex-row-reverse" > 
                                        <h2>P {{ total_amount }}</h2>
                                        <h2  class="mr-3">Total Amount:</h2>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="d-flex flex-row-reverse"  >
                                    <v-btn color="primary" @click="add_stockin" :disabled = "addItems">Add Item</v-btn>
                                    </div>
                                </v-col>
                            </v-row> 
                             <v-card>
                                <v-simple-table fixed-header :height="'500px'">
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
                                    <tr v-for="(item,key) in stockInData" :key="key" class="font-weight-regular">
                                        <td><h3>{{ item.name }}</h3></td>
                                        <td ><h3>{{ item.quantity }}</h3></td>
                                        <td><h3>{{ item.price }}</h3></td> 
                                        <td><h3>{{ item.total }}</h3></td> 
                                        <td style="color:red; cursor:pointer" @click="remove_product(key)">DELETE</td> 
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><h3>Total Amount</h3></td> 
                                        <td><h3>{{ total_amount }}</h3></td> 
                                    </tr>
                                    </tbody>
                                </template>
                                </v-simple-table>
                                </v-card>
                        </v-col>
                    </v-row>
                       
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
    </div>
</template>
<script>
import axios from 'axios';
import forEach from "lodash/forEach";
// import indexOf from "lodash/indexOf";
export default ({
    setup() {
        
    },
    props:['stock','supplier' , 'product', 'track'],
    data:()=>({
        stockInfo:{
            data:{
                product:{},
                payment_method:{}
            },
            track_id:"",
            supplier_id:"",
            customer_id:""

        },
        stockInData:[],  
        date: new Date().toISOString().substr(0, 10), 
        modal: false,
        stockIn:{  
            name:"",
            quantity:"",
            price:"",
            total:0, 
            product_id:""
            }, 
        total_amount:0,
    }),
    methods:{
        async save_stockin(){   
          this.stockInfo.total_amount = this.total_amount;
          this.stockInfo.data = JSON.stringify(this.stockInData);
          axios.post(this.$parent.ipaddress+"/api/addStockin", this.stockInfo).then((response) => { 
           console.log(response.data); 
            for(var x = 0; x < this.product.length; x++){ 
            for(var y=0; y<this.stockInData.length; y++){
                if(this.product[x].product_id === this.stockInData[y].product_id){ 
                this.product[x].stock = parseInt(this.product[x].stock) + parseInt(this.stockInData[y].quantity); 
                this.update_stock_in_product(this.product[x]);
              }
            }
          } 
          this.$parent.stock.in = false; 
          this.$parent.toast('Successfully added to stock-in!','info');
        })
        .catch((error) => { 
          this.$parent.stock.in = false; 
          console.log("Error in " + error);    
          this.$parent.toast('Something went wrong','error'); 
        }); 
    },
        async update_stock_in_product(product){  
            axios.put(this.$parent.ipaddress+"/api/editProduct", product).then((response) => { 
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
            this.$parent.toast('Something went wrong','error'); 
            this.stockInData = [];
            this.stockInfo = {};
            this.total_amount = 0; 
            });
        },
        add_stockin(){
            this.stockInfo.date = this.date;
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
    close_stock_in_and_out(status){
      if(status === 'in'){
        this.$parent.stock.in = false;
      }else{
        this.$parent.stock.in = false; 
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
    assign(data) {
            return JSON.parse(JSON.stringify(data));
        },
    remove_product(index){ 
        this.total_amount = 0;
        this.stockInData.splice(index,1);
        forEach(this.stockInData , (item)=>{
        this.total_amount = item.total + this.total_amount;
      })
    },
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
})
</script>
