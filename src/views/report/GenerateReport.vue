<template>
    <div> 
        <center>
            <h1>Generate Reports</h1>
            <v-row>
                <v-col cols="12" md="4">
                    <v-dialog  ref="dialog" :return-value.sync="date" ersistent width="290px">
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="date" label="Date"  prepend-icon="mdi-calendar" readonly  v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="$refs.dialog.save(new Date().toISOString().substr(0, 10))">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">
                        OK
                    </v-btn>
                    </v-date-picker>
                </v-dialog>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select :items="['Inventory','Sales']" label="Reports" required  v-model="select_dp" @input="select_dropdown()"></v-select>
                </v-col>
                <v-col>
                    <v-btn  class="pa-2 ma-2 "  color="primary" @click="addReport()">
                        Save Report
                    </v-btn>
                    <!-- <v-btn  class="pa-2 ma-2 "  color="primary" @click="addReport()">
                        Print Report
                    </v-btn>
                    <v-btn  class="pa-2 ma-2 "  color="primary" @click="addReport()">
                        Print Inventory
                    </v-btn> -->
                </v-col>
            </v-row>
        </center>  
        <hr>
        <div class="mr-6 ml-6" v-if="select_dp == 'Inventory'"> 
            <v-row> 
                <v-col  cols="12" md="8" >
                    <v-card>
                        <v-simple-table fixed-header dark>
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
                                    <td>{{ key }}</td>
                                    <td> {{ item.description}} </td>
                                    <td>{{ item.begInv }}</td>
                                    <!-- <td>0</td> -->
                                    <td>{{ item.sold }}</td>  
                                    <td>{{ item.endingInv }}</td>  
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card>
                        <div id="chart">
                            <VueApexCharts type="pie" width="380" :options="chartOptions" :series="series"></VueApexCharts>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <div v-else-if="select_dp == 'Sales'"> 
            <div class="mr-6 ml-6">
            <v-row> 
                <v-col  cols="12" md="12" >
                    <v-card class="pa-md-2">
                        <h3>Summary</h3>
                        <v-simple-table fixed-header dark>
                            <template v-slot:default>
                                <thead>
                                <tr>  
                                    <th class="text-left"><h2>Date</h2></th>  
                                    <th class="text-left"><h2>Investment</h2></th> 
                                    <th class="text-left"><h2>Expenses</h2></th> 
                                    <th class="text-left"><h2>Total</h2></th> 
                                    <th class="text-left"><h2>Gross Profit</h2></th> 
                                    <th class="text-left"><h2>Net Profit</h2></th> 
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                <td>{{report_sales.date}}</td><td>{{report_sales.investment}}</td><td>{{report_sales.totalExpenses}}</td><td>{{report_sales.gross_profit}}</td><td>{{report_sales.total_amount}}</td><td>{{report_sales.net_profit}}</td>
                                </tr> 
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-col>
            </v-row>
            <hr>
            <v-row> 
                <v-col  cols="12" md="8">
                    <v-card class="pa-md-2">
                        <h3>Sales</h3>
                        <v-simple-table fixed-header dark>
                            <template v-slot:default>
                                <thead>
                                <tr>  
                                    <th class="text-left"><h2>Item Name</h2></th>  
                                    <th class="text-left"><h2>Investment</h2></th> 
                                    <th class="text-left"><h2>Quantity</h2></th> 
                                    <th class="text-left"><h2>Amount</h2></th> 
                                    <th class="text-left"><h2>Total Amount</h2></th> 
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,key) in product" :key="key" class="font-weight-regular">
                                    <td>{{ item.description }}</td>
                                    <td> {{ (item.original_price*item.qty)}} </td>
                                    <td>{{ item.qty }}</td>
                                    <td>{{ (item.price ) }}</td>
                                    <td>{{ (item.price*item.qty) }}</td>  
                                </tr>
                                <tr>
                                    <td>Total</td><td>{{investment}}</td><td></td><td></td><td>{{total_amount}}</td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-col>
                <v-col  cols="12" md="4"> 
                    <v-card class="pa-md-2">
                    <h3>Expenses</h3>
                    <div class="d-flex flex-row-reverse" > 
                        <v-btn  class="pa-2 ma-2 "  color="primary" @click="addExpenses()" :disabled='disbut'>
                        Add Expenses
                        </v-btn>
                        <div>
                            <v-text-field label="Cost"  persistent-hint required type="number" v-model="form.cost"></v-text-field>
                        </div>
                        <div class="mr-2">
                            <v-text-field label="Description"  persistent-hint required type="text" v-model="form.desc"></v-text-field>
                        </div>
                    </div>
                    <v-card>
                        <v-simple-table fixed-header dark>
                            <template v-slot:default>
                                <thead>
                                <tr>  
                                    <th class="text-left"><h2>Description</h2></th> 
                                    <th class="text-left"><h2>Expenses</h2></th> 
                                    <th class="text-left"><h2>Action</h2></th> 
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,key) in expenses" :key="key" class="font-weight-regular">
                                    <td>{{ item.desc }}</td>
                                    <td>{{ item.cost }}</td> 
                                    <td>
                                    <!-- <v-btn  class="pa-2 ma-2 "  color="primary" @click="addExpenses()" >Edit</v-btn> -->
                                    <v-btn  class="pa-2 ma-2 "  color="warning" @click="removeExpenses(item)" >Delete</v-btn>
                                    </td> 
                                </tr>
                                <tr>
                                <td>Total</td><td>{{totalExpenses}}</td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                    </v-card>
                </v-col>
            </v-row> 
            </div>
        </div>   
    </div>
</template>
<script>
import Helper from "../helper/helper.js";
import forEach from "lodash/forEach";
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts'; 
export default {
    mixins:[Helper],
    components: {
          VueApexCharts,
        },
    data:() => ({ 
        inventory:[],
        stock_out_data:{},
        invents:{},
        date: new Date().toISOString().substr(0, 10),
        summary_SI:[],
        product:[], 
        total_amount:0,
        total_sale:0,
        form:{cost:'',desc:''},
        expenses:[], 
        investment:0,
        totalExpenses:0,
        series: [60,40],
          chartOptions: {
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
        list_inventory:[],
        select_dp:'Sales',
        report_sales:{
            date:'',
            investment:'',
            totalExpenses:'',
            gross_profit:0,
            total_amount:'',
            net_profit:''

        },
        submit_form:{
            report:'',
            expense:'',
            sold:'',
            data:''

        }
    }),
    methods:{ 
        generateReport(){
              this.report_sales = Object.assign({date:this.date,investment:this.investment,totalExpenses:this.totalExpenses,total_amount:this.totalExpenses+this.investment,
                                                gross_profit:this.total_amount,net_profit:this.total_amount - (this.totalExpenses+this.investment)});
            
        },
        async addReport(){ 
            this.generateReport();
            console.log(this.report_sales);
            this.submit_form.report = JSON.stringify(this.report_sales);
            this.submit_form.expense = JSON.stringify(this.expenses);
            this.submit_form.sold = JSON.stringify(this.product);
            this.submit_form.inventory = JSON.stringify(this.list_inventory);
            this.submit_form.date = this.date;
            let temp_data = await axios.post(this.ipaddress+'/api/addReports', this.submit_form);
            console.log(temp_data.data); 
            this.toast('Successfully added!','info'); 
        },
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
            this.series = [parseInt(stock),parseInt(sold)];
            console.log(this.series)
       
        },
        select_dropdown(){ 
            this.stock_out(); 
        },
        addExpenses(){
            this.expenses.push(this.form);
            this.form = Object.assign({desc:'',cost:0})
            var totalExpe = 0;
            forEach(this.expenses,(expense)=>{
                totalExpe = parseFloat(totalExpe) + parseFloat(expense.cost);
            }) 
            this.totalExpenses = totalExpe; 
            this.generateReport();
          
        },
        count_total_andSale(){ 
            this.total_amount = 0;
            this.investment = 0; 
            forEach(this.product, (x)=>{
                var sale_price = x.qty * parseFloat(x.price);
                var orig_price = x.qty * parseFloat(x.original_price);
                this.total_amount = sale_price + this.total_amount; 
                this.investment = orig_price + this.investment;
            }) 
        },
         async stock_out(){ 
            let temp = await axios.get(this.ipaddress+'/api/stockoutcal/'+this.date); 
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
            await this.count_total_andSale(); 
            await this.inventory_set(); 
            await this.generateReport();
        }, 
        async temp_stock_out(){ 
            //==var date = "2021-02-21";
            //let temp = await axios.get(this.ipaddress+'/api/stockoutcal/'+new Date().toISOString().substr(0, 10));
            let temp = await axios.get(this.ipaddress+'/api/stockoutcal/'+this.date); 
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
                        } 
                    })
                    
            }); 
            });
            this.invents = invent;
            await this.select_dropdown();
        },
        removeExpenses(item){
            const data = this.expenses.indexOf(item);
            this.expenses.splice(data,1);  
            var totalExpe = 0;
            forEach(this.expenses,(expense)=>{
                totalExpe = parseFloat(totalExpe) + parseFloat(expense.cost);
            }) 
            this.totalExpenses = totalExpe; 
            this.stock_out()
        }
 
    },
    created(){
        this.temp_stock_out();  
    },
    computed:{
        disbut(){
            return (this.form.cost.length <= 0) || (this.form.desc.length <= 0)  
        }
    }
   
}
</script>
<style>
 
</style>