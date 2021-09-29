<template>
    <div>  
        <v-row>
            <v-dialog v-model="stock" persistent max-width="2000px" style="height:100%">
            <v-card>
                <v-card-title>
                    <span class="headline">Stock-Out</span>
                </v-card-title>
                <v-card-text>  
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-card class="pa-md-4"> 
                                 <v-card-title>
                                    <span class="headline"><h4>CUSTOMER</h4></span>
                                </v-card-title>  
                                    <v-select :items="track" label="Panel*" required item-text="name" v-model="stockOutfo.track_id" item-value="track_id"></v-select>
                                    <v-select :items="customer" label="Customer*" required item-text="name" v-model="stockOutfo.customer_id" item-value="customer_id"></v-select>
                                    <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field  v-model="date" label="Date Today" prepend-icon="mdi-calendar"  readonly v-bind="attrs" v-on="on" ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="modal = false">
                                            Cancel
                                        </v-btn>
                                        <v-btn text color="primary" @click="$refs.dialog.save(date)">
                                            OK
                                        </v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                            </v-card>
                            <br>
                            <v-card>
                                <v-card-title>
                                    <span class="headline"><h3>Payment Method</h3></span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                    <v-row>
                                        <v-col cols="12" md="6">
                                        <v-select :items="['Paid - Full', 'Paid - Partial']" label="Cash*" required v-model="payment_method.status" @change="statusPayment()"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                        <v-text-field :disabled = "(payment_method.status === 'Unpaid') || (payment_method.status === 'Paid - Full')  ? true : false" label="Amount" persistent-hint required v-model="payment_method.payment" type="number" :rules="[ (value) => { return (genericRequiredRule(value)) }]"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                        </v-col> 
                                        <h6 style="display:none;">{{payment_method.balance = total_amount-payment_method.payment}}</h6>
                                        <v-col cols="12" sm="6">
                                        <v-text-field disabled label="Balance" persistent-hint required v-model="payment_method.balance" type="number"></v-text-field>
                                        </v-col>
                                         <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="close_stock_in_and_out('out')">
                                            Close
                                            </v-btn>
                                            <v-btn color="blue darken-1" text @click="saveWar" :disabled = 'stockOutData.length <= 0 || payment_method.status == ""'> Save </v-btn>
                                        </v-card-actions>
                                    </v-row> 
                                </v-container>
                                </v-card-text>
                                </v-card>
                        </v-col>
                        <v-col cols="12" md="8">
                            <v-card class="pa-md-2 mb-2">
                                <v-row> 
                                <v-col cols="12" md="12">
                                <br> 
                                <h1>ITEMS</h1>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select :items="product" label="Products*" required v-model="stockOut.product_id" item-value="product_id" item-text="description" @change="get_pro"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                <v-text-field
                                    label="Quantity" 
                                    persistent-hint
                                    required
                                    v-model="stockOut.quantity"
                                    type="number"
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                <v-text-field
                                    label="Price" 
                                    persistent-hint
                                    required
                                    v-model="stockOut.price"
                                    type="number"
                                ></v-text-field>
                                </v-col> 
                                <v-col cols="12" md="12">
                                <div class="d-flex flex-row-reverse"   >
                                    <v-btn  color="primary" @click="add_stockout" :disabled = 'addStockout'>
                                        Add Item
                                    </v-btn>
                    
                                </div>
                                </v-col>
                            </v-row> 
                            </v-card> 
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
                                        <tr
                                            v-for="(item,key) in stockOutData"
                                            :key="key"
                                            class="font-weight-regular"
                                        >
                                            <td>{{ item.name }}</td>
                                            <td>{{ item.quantity }}</td>
                                            <td>{{ item.price }}</td> 
                                            <td>{{ item.total}}</td> 
                                            <td style="color:red; cursor:pointer;" @click="remove_product(key)">DELETE</td> 
                                        </tr>
                                        <tr>
                                                <td></td>
                                                <td></td>
                                                <td><h1>Total Amount</h1></td> 
                                                <td><h2>{{ total_amount }}</h2></td> 
                                        </tr>
                                        </tbody>
                                    </template> 
                                    </v-simple-table>
                                </v-card>
                        </v-col>
                    </v-row> 
                </v-card-text>  
            </v-card>
            </v-dialog>
        </v-row>
        <v-row justify="center">
            <v-dialog v-model="modalSave" persistent max-width="390"> 
            <v-card>
                <v-card-title class="text-h6">
                    Are you sure you want to save?
                </v-card-title> 
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="modalSave = false">
                    Disagree
                </v-btn>
                <v-btn color="green darken-1" text @click="save_stockout()" >
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
import forEach from "lodash/forEach";
// import indexOf from "lodash/indexOf";
export default ({
    setup() {
        
    },
    props:['stock','customer' , 'product', 'track'],
    data:()=>({
        stockOutfo:{
            data:{
                product:{},
                payment_method:{}
            },
            track_id:"",
            supplier_id:"",
            customer_id:""

        },
        stockOutData:[],  
        date: new Date().toISOString().substr(0, 10), 
        modal: false,
        stockOut:{  
            name:"",
            quantity:"",
            price:"",
            total:0, 
            product_id:""
            }, 
        total_amount:0,
        payment_method:{
        status:'',
        balance:0,
        payment:0, 
        },
        modalSave:false
    }),
    methods:{
        statusPayment(){ 
            if(this.payment_method.status == "Paid - Full"){ 
                this.payment_method.payment = this.total_amount;
            }else if (this.payment_method.status){
                this.payment_method.payment = 0;
            } 
        },
        genericRequiredRule(v){  
                if (!isNaN(parseFloat(v)) && v >= 1 && v <= this.total_amount) return true;
                return 'Number has to be between 0 and '+ this.total_amount;
            },
            totalGetPerItem(productId,stock_available){ 
                if(this.stockOutData.length >  0){
                    var countQnt = 0; 
                    const find = this.stockOutData.find(element => element.product_id == productId); 
                    console.log(find)
                    if(find != undefined){
                        forEach(this.stockOutData , (item)=>{
                            if(item.product_id == productId){
                            countQnt = parseInt(item.quantity) + parseInt(this.stockOut.quantity); 
                            if(stock_available > countQnt){
                                item.quantity = countQnt; 
                                item.total = parseInt(countQnt * this.stockOut.price);
                            }
                            else{
                                this.$parent.toast('Insufficient Stock','error');
                            } 
                            }
                        })
                    }else{
                      this.stockOutPush(stock_available);  
                    }
                    
                }else if(this.stockOutData.length <= 0){
                    this.stockOutPush(stock_available);
                }
                
            },
            stockOutPush(stock_available){
                if(stock_available>= this.stockOut.quantity){
                    this.stockOut.total = parseInt(this.stockOut.quantity * this.stockOut.price);
                    let temp_data = this.assign(this.stockOut)
                    this.stockOutData.push(temp_data);
                    forEach(this.stockOutData , (item)=>{
                    this.total_amount = item.total + this.total_amount;
                    }) 
                    this.stockOut.quantity=''
                    this.stockOut.price=''; 
                    this.stockOut.total=0
                    this.stockOut.product_id = ""
                }else{
                    this.$parent.toast('Insufficient Stock','error');
                }
                
            },
            add_stockout(){ 
                this.stockOutfo.date = this.date;
                this.total_amount = 0;
                let stock_available=0;
               
                forEach(this.product ,(item) =>{
                    if(item.product_id === this.stockOut.product_id){
                    this.stockOut.name = item.description; 
                    stock_available = parseInt(item.stock);
                    }
                })
                    this.totalGetPerItem(this.stockOut.product_id,stock_available)
                },
        async update_stock_in_product(product){  
            axios.put(this.$parent.ipaddress+"/api/editProduct", product).then((response) => { 
            console.log(response.data); 
                this.stockOutData = [];
                this.stockOutfo = {data:{
                                product:{},
                                payment_method:{}
                                }};
                this.total_amount = 0; 
            })
            .catch((error) => {
            console.log("Error in " + error);  
            this.$parent.toast('Something went wrong','error'); 
            this.stockOutData = [];
            this.stockOutfo = {};
            this.total_amount = 0; 
            });
        },
          async save_stockout(){
                this.stockOutfo.total_amount = this.total_amount;
                this.stockOutfo.data.product = (this.stockOutData);
                this.stockOutfo.data.payment_method = (this.payment_method);
                axios.post(this.$parent.ipaddress+"/api/addStockout", this.stockOutfo).then((response) => {
                console.log(response.data); 
                for(var x = 0; x < this.product.length; x++){ 
                    for(var y=0; y<this.stockOutData.length; y++){
                        if(this.product[x].product_id === this.stockOutData[y].product_id){ 
                        this.product[x].stock = parseInt(this.product[x].stock) - parseInt(this.stockOutData[y].quantity); 
                        this.update_stock_in_product(this.product[x]);
                    }
                    }
                } 
                this.$parent.stock.out = false;
                this.$parent.toast('Successfully added to stock-out!','info');
                this.stockOutData=[];
                }).catch((error)=>{  
                    console.log(error)
                    this.$parent.toast('Something went wrong','error'); 
                    this.$parent.stock.out = false;
                }); 
            }, 

            saveWar(){
                if(this.payment_method.status == "Paid - Full"){ 
                    this.modalSave = true
                }else if (this.payment_method.status  == "Paid - Partial"){
                    if(this.payment_method.payment > this.total_amount || this.payment_method.payment <= 0){ 
                        this.$parent.toast('Check your payment','error'); 
                    }else{
                         this.modalSave = true
                    }
                }
            },

            get_pro(){ 
                forEach(this.product,(item)=>{
                    if(item.product_id == this.stockOut.product_id){
                    this.stockOut.price = item.sellingprice;
                    }
                })
                },
            close_stock_in_and_out(status){
            if(status === 'in'){
                this.$parent.stock.out = false;
            }else{
                this.$parent.stock.out = false; 
            }
            this.total_amount = 0;
            this.stockOut.product_id='';
            this.stockOut.name='';
            this.stockOut.quantity=''
            this.stockOut.price=''; 
            this.stockOut.total=0;
            this.stockOutData = []; 
            },
    assign(data) {
            return JSON.parse(JSON.stringify(data));
        },
    remove_product(index){ 
        this.total_amount = 0;
        this.stockOutData.splice(index,1);
        forEach(this.stockOutData , (item)=>{
        this.total_amount = item.total + this.total_amount;
      })
    },
    
    },
    
     computed:{
    isDisable(){    
        return (this.form.description.length <= 0) || (this.form.price.length <= 0) || (this.form.measure.length <= 0) || (this.form.sellingprice.length <= 0);
      }, 
     addStockout(){ 
      return (this.stockOut.product_id.length <= 0) || (this.stockOut.price.length <= 0) || (this.stockOut.quantity.length <= 0)|| (this.stockOutfo.customer_id <= 0) || (this.stockOutfo.track_id <= 0);
    }
  }
})
</script>
