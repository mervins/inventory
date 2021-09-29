<template>
    <div>  
         <v-card v-if="tab == 0"> 
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
                            <td>{{profit.date}}</td><td>{{profit.investment}}</td><td>{{profit.totalExpenses}}</td><td>{{profit.gross_profit}}</td><td>{{profit.total_amount}}</td><td>{{profit.net_profit}}</td>
                            </tr> 
                            </tbody>
                        </template>
                    </v-simple-table>
            </v-card> 
            <v-card v-if="tab == 1">
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
                        <tr v-for="(item,key) in revenue" :key="key" class="font-weight-regular">
                            <td>{{ item.description  }}</td>
                            <td> {{ (item.original_price * item.qty)}} </td>
                            <td>{{ item.qty }}</td>
                            <td>{{ (item.price) }}</td>
                            <td>{{ (item.price * item.qty) }}</td>  
                        </tr>
                        <tr>
                            <td>Total</td><td>{{totlaAmount(revenue).total1}}</td><td></td><td></td><td>{{totlaAmount(revenue).total2}}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card> 
            <v-card v-if="tab == 2">
                <v-simple-table fixed-header dark>
                    <template v-slot:default>
                        <thead>
                        <tr>  
                            <th class="text-left"><h2>Description</h2></th> 
                            <th class="text-left"><h2>Expenses</h2></th> 
                            <!-- <th class="text-left"><h2>Action</h2></th>  -->
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,key) in expenses" :key="key" class="font-weight-regular">
                            <td>{{ item.desc }}</td>
                            <td>P {{ item.cost }}</td> 
                            <!-- <td><v-btn  class="pa-2 ma-2 "  color="primary" @click="addExpenses()" >Edit</v-btn>
                            <v-btn  class="pa-2 ma-2 "  color="warning" @click="addExpenses()" >Delete</v-btn>
                            </td>  -->
                        </tr>
                        <tr>
                        <td>Total</td><td><b>P {{computeTotal(expenses)}}</b></td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>  
            <v-card v-if="tab == 3">
                <v-simple-table fixed-header dark>
                    <template v-slot:default>
                        <thead>
                        <tr>  
                            <th class="text-left"><h2>DESCRIPTION</h2></th> 
                            <th class="text-left"><h2>STARTING INVENTORY</h2></th> 
                            <th class="text-left"><h2>SOLD</h2></th> 
                            <th class="text-left"><h2>ENDING INVENTORY</h2></th> 
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,key) in inventory" :key="key" class="font-weight-regular">
                            <td>{{ item.description }}</td>
                            <td> {{ item.begInv }}</td> 
                            <td>{{ item.sold }}</td>
                            <td> {{ item.endingInv }}</td> 
                       
                        </tr> 
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>  
        </div>    
</template>
<script> 
import forEach from "lodash/forEach";
export default({ 
    props:['revenue','expenses','profit', 'tab', 'inventory'],
    setup() {
        
    },
    data:()=>({
        list:[]
    }),
    created(){
        
    }, 
    methods:{
        computeTotal(list){
            var total = 0;
            forEach(list, (item)=>{
                total = parseFloat(item.cost) + total 
            }); 
            return total;
        },
        totlaAmount(list){
            var total1 = 0;
            var total2 = 0;
            forEach(list, (item)=>{
                var temp1 = parseFloat(item.original_price) * item.qty;
                var temp2 = parseFloat(item.price) * item.qty; 
                total1 = temp1 + total1;
                total2 = temp2 + total2;
            });
            return {total1:total1, total2:total2}
        }
    } 
})
</script>
