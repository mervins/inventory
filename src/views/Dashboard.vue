<template>
  <div class="about" v-if="!loading">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <v-card> 
    </v-card> 
    <!-- <salesChart></salesChart>   -->
    <v-card class="ml-5 mr-5">
      <v-row class="ml-1 mr-1">
      <v-col cols="12" md="8">
        <v-card class="mx-auto outlined pl-5">
            <div class="d-flex flex-row pt-2">
                <v-card class="d-inline-flex pa-4 mr-2"><h2>Weekly Sales</h2></v-card>
                <v-card class="d-inline-flex mr-2"><v-dialog
                    ref="dialog" v-model="modal" :return-value.sync="date" persistent  width="290px" >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="date"  label="Date Today" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="changeDates">
                        OK
                      </v-btn>
                    </v-date-picker>
                </v-dialog></v-card>
            </div> 
            <VueApexCharts width="900" height="350" type="bar" :options="chartOptions" :series="series"></VueApexCharts>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <h2>Daily Inventory Average</h2>
          <div id="chart">
              <VueApexCharts type="pie" width="380" :options="chartOptionsPie" :series="seriesPie"></VueApexCharts>
          </div>
        </v-card>
      </v-col>
    </v-row>
    </v-card>
     <v-card class="mt-3 pa-md-4 ml-5 mr-5">
       <h3>Dialy Inventory</h3>
        <v-simple-table fixed-header>
          <template v-slot:default>
            <thead>
            <tr>  
                <th class="text-left"><h2>No.</h2></th>  
                <th class="text-left"><h2>Description</h2></th> 
                <th class="text-left"><h2>Starting Inventory</h2></th> 
                <!-- <th class="text-left"><h2>Loss/Damage</h2></th>  -->
                <th class="text-left"><h2>Sold</h2></th> 
                <th class="text-left"><h2>Ending Inventory</h2></th> 
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,key) in list_inventory" :key="key" class="font-weight-regular">
                <td>{{ key + 1}}</td>
                <td> {{ item.description}} </td>
                <td> <h3 v-if="parseInt(item.min) >= parseInt(item.stock)" class="red--text">{{ item.begInv }}</h3>
                <h3 v-else>{{ item.begInv }}</h3></td>
                <!-- <td>0</td> -->
                <td><h3>{{ item.sold }}</h3></td>  
                <td><h3>{{ item.endingInv }}</h3></td>  
            </tr>
            </tbody>
          </template>
    </v-simple-table>
</v-card>
  </div>
</template>
<script>
import axios from 'axios';
import json from "./helper/weather.json";
//import HelloWorld from '@/components/HelloWorld.vue'
import VueApexCharts from 'vue-apexcharts';
// import salesChart from '../views/chart/sales.vue';
import Helper from "../views/helper/helper.js";
import forEach from "lodash/forEach";
export default {
  mixins:[Helper],
  components: {
    //HelloWorld
    VueApexCharts,
   
  },
  data:()=>({ 
    temp_json:json,
    data:[],
    user:{},
    form:{
      name:'adhkajsdhaksdh',
      password:'ajdgagsdhjas',
      username:'agdshjajhsdg'
    },
    chartOptions: {
        chart: {
          id: 'basic-bar'
        },
        xaxis: {
          categories: ['Mon', 'Teu', 'Wen', 'Thur', 'Friday', 'Sat', 'Sun']
        }
      },
      series: [{
        name: 'series-1',
        data: [0, 0, 0, 0, 0, 0, 0]
      }],
      seriesPie: [100,0],
      chartOptionsPie: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: ['Inventory', 'Sold',],
        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name, val.toFixed(1) + '%']
          }
        }, 
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }, 
      date: new Date().toISOString().substr(0, 10),
      modal:false,
      loading:true,
      list_inventory:[], 
      product:[],  
      invents:{},
      stockOut:{}
           
  }),
  mounted(){
    this.initialize(new Date());
  },
  methods:{ 
    inventory_set(){
            var total_qty_stock = 0;
            var total_qty_sold = 0;
            this.list_inventory = []
            forEach(this.invents.data,(inv)=>{   
                inv.endingInv = inv.stock;
                inv.begInv= inv.stock;
                inv.sold = 0;
                forEach(this.product,(prod)=>{
                    if(prod.product_id == inv.product_id){
                        inv.endingInv  = parseFloat(inv.stock);
                        inv.sold = parseFloat(prod.qty)  
                        inv.begInv = parseFloat(inv.sold) + parseFloat(inv.endingInv); 
                    }
                })   
                this.list_inventory.push(inv);
            }) 
            forEach(this.list_inventory,(list)=>{
                total_qty_sold = parseFloat(total_qty_sold) + parseFloat(list.sold);
                total_qty_stock = parseFloat(total_qty_stock) + parseFloat(list.begInv);
            })
            console.log((total_qty_sold) + " " + total_qty_stock);
            var result = parseFloat(total_qty_sold/total_qty_stock)*100;
            var sold = result.toFixed(2); 
            var stock = 100 - sold; 
            this.seriesPie = [parseInt(stock),parseInt(sold)];
            console.log(this.seriesPie)
       
    },
    async getInventory(){ 
            var date = new Date().toISOString().substr(0, 10);
            this.stockOut= await axios.get(this.ipaddress+'/api/stockoutcal/'+date); 
            let temp = this.stockOut;
            let invent = (await this.get_product());
            forEach(invent.data,(invents)=>{
                invents.sold = 0;
                invents.total = 0;
            });
            forEach(invent.data,(invents)=>{
                forEach(temp.data, (item)=>{
                    var temp_data = JSON.parse(item.data);
                    forEach(temp_data.product,(prod)=>{
                        if(invents.product_id == prod.product_id){ 
                            invents.sold += parseInt(prod.quantity);
                            console.log( invents.sold);
                        } 
                    }) 
            }); 
            });
            
            console.log(invent.data);
            console.log("-------------------------------");
            this.invents = invent;
            await this.stock_out()
            // setTimeout(() => {},500);  
        },
    async stock_out(){ 
            let temp = this.stockOut; 
            let temp_all_trans = []; 
            let temp_collect_product_id = []; 
            let collect_product = [];
            console.log(temp)
            forEach(temp.data, (item)=>{ //collect all product_id(s) and product
                var temp_decode = JSON.parse(item.data);
                forEach(temp_decode.product,(product)=>{
                    temp_collect_product_id.push(product.product_id); 
                    collect_product.push(product)
                })
            }); 
            var collect_product_id = temp_collect_product_id.filter((item, index) => temp_collect_product_id.indexOf(item) === index); //remove duplicate ids
            forEach(collect_product_id,(id)=>{temp_all_trans.push({product_id:id, description:'', qty:0, price:0 , original_price:0}) }) // set format in transaction data
            var i = 0;
            forEach(collect_product_id,(id)=>{ // liquidate quantity
                forEach(collect_product,(item)=>{
                   if(item.product_id == id){
                       temp_all_trans[i].description = item.name;
                       temp_all_trans[i].price = item.price;
                       temp_all_trans[i].qty = parseFloat(item.quantity) + parseFloat(temp_all_trans[i].qty);
                   }
                }) 
                i++;
            }) 
            forEach(this.invents.data,(prod)=>{ // get the original price
                forEach(temp_all_trans,(trans)=>{
                    if(prod.product_id == trans.product_id){
                        trans.original_price = prod.price;
                    }
                })
            })
            console.log(temp_all_trans); 
            this.product = temp_all_trans;    
            await this.inventory_set();  
        },
    async initialize(setDate){
        this.loading = true;
        var list_date = [];
        console.log(setDate)
        var currentDate = setDate;
        let yesterday = new Date(); 
        yesterday.setDate(currentDate.getDate() - 1); 
        for(var x = 1; x <= 7; x++){
            var nextday = new Date(currentDate.setDate(yesterday.getDate() - yesterday.getDay() + x));
            list_date.push(nextday.toJSON().slice(0, 10).replace(/-/g, '-'));
        } 
        this.form.list  = list_date;
        let temp_data =  await axios.post(this.ipaddress+'/api/dashboard', this.form);
        this.data = temp_data; 
        this.checkDates(temp_data.data,list_date); 
        this.getInventory();
    },
    checkDates(dataList,dates){
      this.series[0].data = [];
      var storageProfit = [];
      var index = 0;
      for(const date of dates){
        for(const item of dataList){
          if(date == item.date){ 
            var temp = JSON.parse(item.data_report)
            storageProfit.push(temp.gross_profit)
          } 
        }
        if(storageProfit.length-1 != index){
            storageProfit.push(0)
        }
        index++;
      }
      this.series[0].data = storageProfit  
     for(const item of dataList){ 
          var tempInve = JSON.parse(item.data_inventory)
          console.log(tempInve);
      }
      this.loading =false
    },
    changeDates(){
      this.initialize(new Date(this.date))
      this.modal = false
    },
      
  }
}
</script>
<style scoped>
.buttons{
  cursor: pointer;
  background-color: rgb(105, 155, 179) !important;
}
.buttons:hover{ 
  background-color: rgb(244, 244, 245) !important;
}
.about{
  height: 100%;
  /* background-color: rgb(243, 243, 245) !important; */
  background: #777;
  position:relative;
}
 
</style>
