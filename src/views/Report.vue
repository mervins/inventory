<template>
    <div class="report">
        <center>
            <h1>Generate Reports</h1>
            <v-row>
                <v-col cols="12" md="3"></v-col>
                <v-col cols="12" md="3">
                    <v-dialog
                    ref="dialog"
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
                      <v-btn text color="primary" @click="$refs.dialog.save(new Date().toISOString().substr(0, 10))">
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
                <v-col cols="12" md="3">
                    <v-select :items="['Inventory','Sales','Stock-in']" label="Reports" required  v-model="select_dp" @change="select_dropdown()"></v-select>
                </v-col>
            </v-row>
        </center>
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
                                    <th class="text-left"><h2>Loss/Damage</h2></th> 
                                    <th class="text-left"><h2>Sold</h2></th> 
                                    <th class="text-left"><h2>Ending Inventory</h2></th> 
                                </tr>
                                </thead>
                                <tbody>
                                 <tr v-for="(item,key) in list_inventory" :key="key" class="font-weight-regular">
                                    <td>{{ key }}</td>
                                    <td> {{ item.description}} </td>
                                    <td>{{ item.begInv }}</td>
                                    <td>0</td>
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
            <div class="mr-6 ml-6">
             <v-row> 
                <v-col  cols="12" md="12" >
                    <v-card>
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
                                  <td>{{date}}</td><td>{{investment}}</td><td>{{totalExpenses}}</td><td>{{totalExpenses+investment}}</td><td>{{total_amount}}</td><td>{{total_amount - (totalExpenses+investment)}}</td>
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
                    <v-card>
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
                    <v-card>
                        <v-simple-table fixed-header dark>
                            <template v-slot:default>
                                <thead>
                                <tr>  
                                    <th class="text-left"><h2>Description</h2></th> 
                                    <th class="text-left"><h2>Expenses</h2></th>  
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,key) in expenses" :key="key" class="font-weight-regular">
                                    <td>{{ item.desc }}</td>
                                    <td>{{ item.cost }}</td> 
                                </tr>
                                <tr>
                                <td>Total</td><td>{{totalExpenses}}</td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-col>
            </v-row> 
            </div>
        </div> 
    </div>
</template>
<script>
import Helper from "../views/helper/helper.js";
import {saveAs} from "file-saver";
import forEach from "lodash/forEach";
import axios from 'axios';
import { Document, Packer, Paragraph, Table,TableRow, TableCell, WidthType,HeadingLevel,AlignmentType,TextRun,Header } from "docx";
import VueApexCharts from 'vue-apexcharts'
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
        totalExpenses:0,
        investment:0,
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
        select_dp:'Sales'
    }),
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
            this.series = [parseInt(stock),parseInt(sold)];
            console.log(this.series)
       
        },
        select_dropdown(){
            // if(this.select_dp == 'Inventory'){ 
            //      setTimeout(() =>, 100);  
              
            //}
            //else if(this.select_dp == 'Sales'){
                this.stock_out();
                // this.count_total_andSale(); 
                // this.inventory_set();
            //}
            
        },
        addExpenses(){
            this.expenses.push(this.form);
            this.form = Object.assign({desc:'',cost:0})
            var totalExpe = 0;
            forEach(this.expenses,(expense)=>{
                totalExpe = parseFloat(totalExpe) + parseFloat(expense.cost);
            })
            this.totalExpenses = totalExpe;
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
        async export_inventory(){ 
        //this.invents.then((data)=>{  
                // let temp_data = data;
                const temp_inventory = this.invents.data; 
                const doc = new Document();  
                console.log(temp_inventory)
                var grand_total = 0;
                    const table = new Table({
                        rows: temp_inventory.map((item)=>{
                            var temptotal = item.sold * parseInt(item.sellingprice);
                            grand_total += temptotal;
                            return new TableRow({
                                children:[
                                    new TableCell({  
                                        width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                        children: [new Paragraph({bold: true, text: item.description,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                    }), 
                                    new TableCell({  
                                        width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({bold: true, text: item.stock, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                    }),
                                    new TableCell({  
                                        width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({bold: true, text:item.sellingprice , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                    }),
                                    new TableCell({  
                                        width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({bold: true, text:item.sold.toString() , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                    }),
                                    new TableCell({  
                                        width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({bold: true, text:'P '+this.separator_thousand(temptotal).toString() , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                    }),
                                ],  
                            });
                        }),
                    });
                    const heading = ["Description", "Stock", "Price", "Sold","Total"]; 
                    const header = this.heading(heading); 
                    const title = new Paragraph({
                    children:[new TextRun({  
                            text: "List of Inventory",
                            heading: HeadingLevel.HEADING_1,
                            bold:true,
                            color:"140b05",
                            size:"50",  
                        }),],  
                    });
                    const total = ["","","", "Total Amount", 'P '+this.separator_thousand(grand_total)];
                    const _footer = this.footer(total);
                    const _date = new Paragraph({
                    children:[new TextRun({  
                            text: "Date exported: " + new Date(),
                            heading: HeadingLevel.HEADING_1, 
                            color:"140b05",
                            size:"25",  
                        }),],  
                    }); 
                    
                    doc.addSection({
                        properties: {},
                        headers: {
                            default: new Header({
                                children: [new Paragraph({text:"IDELLE'S", alignment: AlignmentType.RIGHT})],
                            }),
                        },
                        children: [
                            title, 
                            _date,
                            header,
                            table, 
                            _footer
                        ],
                    });  
                // Used to export the file into a .docx file
                Packer.toBlob(doc).then((blob) => {
                    console.log(blob);
                    saveAs(blob,"inventory.docx");
                }); 
                // Done! A file called 'My Document.docx' will be in your file system. 
            //});
            
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
            // var doc = new Document();  
            // this.export_data_stockout(temp_all_trans,doc)
            // Packer.toBlob(doc).then((blob) => {
            //     console.log(blob);
            //     saveAs(blob,"Stockout.docx");
            // });   
            await this.count_total_andSale(); 
            await this.inventory_set();
        },
        async stock_in(){
            let temp = await axios.get(this.ipaddress+'/api/stockincal/'+this.date);
            let temp_all_trans = [];
            // console.log(temp);  
            forEach(temp.data, (item)=>{
                    let temp = JSON.parse(item.data); 
                    forEach(temp,(x)=>{
                        //   console.log(x);
                        Object.assign(x,{supp_name:item.Supplier.name,panel_name:item.Track.agent}) 
                    })
                    temp_all_trans.push(...temp);
                }); 
            console.log(temp_all_trans);
            if(temp_all_trans.length > 0){
                var doc = new Document();  
                doc = this.export_data_stockin(temp_all_trans,doc)
                Packer.toBlob(doc).then((blob) => {
                    console.log(blob);
                    saveAs(blob,"Stockin.docx");
                }); 
            }else{
                alert('No Transaction')
            }
        },
        export_data_stockout(data,doc){   
            var temp_data = data; 
            console.log(temp_data);  
            // const table = 
            //         new Table({
            //             rows: temp_data.map((item)=>{ 
            //                 return new TableRow({
            //                     children:[  
            //                         //new Paragraph({bold: true, text: item.client,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, }),
            //                         new TableCell({  
            //                         width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
            //                         children: [new Paragraph({bold: true, text: item.id,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
            //                         }),
            //                         new TableCell({  
            //                             width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
            //                             children: [
            //                                  //new Paragraph({bold: true, text: item.client,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, }),
            //                                 // item.product.map((list)=>{
            //                                 new TableRow({
            //                                     children:[  
            //                                         new TableCell({
            //                                             width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
            //                                             children:[ 
            //                                                     new Paragraph({bold: true, text: item.client,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, }),
            //                                             ],
            //                                         }),    
            //                                     ]
            //                                 })
            //                             //    })
            //                             ]
                                            
            //                         }), 
            //                         // new TableCell({  
            //                         //     width: { size: 100 / 3, type: WidthType.PERCENTAGE },
            //                         // children: [new Paragraph({bold: true, text: item.price, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
            //                         // }),
            //                         // new TableCell({  
            //                         //     width: { size: 100 / 3, type: WidthType.PERCENTAGE },
            //                         //     children: [new Paragraph({bold: true, text: item.quantity, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
            //                         // }),
            //                         // new TableCell({  
            //                         //     width: { size: 100 / 3, type: WidthType.PERCENTAGE },
            //                         //     children: [new Paragraph({bold: true, text: 'P ' +this.separator_thousand(item.total) , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
            //                         // }),
            //                     ],  
            //                     });
            //                 })
            //             }) 
                  
                    
                //const heading = ["Description", "Price","Quantity","Subtotal"];
                // const total = ["","","","","", "Total Amount", 'P '+this.separator_thousand(item.total_amount)];
                // const received = ["","", "Amount received", 'P '+this.separator_thousand(temp_data.payment_method.payment)];
                // const balance = ["","", "Total Balance", 'P '+this.separator_thousand(temp_data.payment_method.balance)];
                //const header = this.heading(heading);
                // const _footer = this.footer(total);
                // const _receive_footer = this.footer(received);
                // const _balance_footer = this.footer(balance);
                // const title = new Paragraph({
                // children:[new TextRun({  
                //         text: "Stock - Out",
                //         heading: HeadingLevel.HEADING_1,
                //         bold:true,
                //         color:"140b05",
                //         size:"50",  
                //     }),], 
                // alignment: AlignmentType.RIGHT
                // }); 
                // const _sub_title = new Paragraph({
                //     children: [ 
                //         new TextRun({
                //             text: "Panel Name: " + item.Track.name, 
                //             size:"25",  
                //         }),  
                //         ], 
                //     });
                // const _sub_title1 = new Paragraph({
                //     children: [ 
                //         new TextRun({
                //             text: "Panel Agent: " + item.Track.agent, 
                //             size:"25"
                //         }), 
                //         ],
                //     });
                // const _sub_title2 = new Paragraph({
                //     children: [  
                //         new TextRun({
                //             text: "Customer Name: "+ item.Customer.name, 
                //             size:"25"
                //         }),
                //         ],
                //     });
                // const _sub_title3 = new Paragraph({
                //     children: [  
                //         new TextRun({
                //             text: "Customer Address: "+ item.Customer.address, 
                //             size:"25"
                //         }),
                //         ],
                //     });
                // const _sub_title4 = new Paragraph({
                //     children: [  
                //         new TextRun({
                //             text: "Date: "+ item.date, 
                //             size:"25"
                //         }),
                //         ],
                //         thematicBreak:true
                //     });
                
                doc.addSection({
                    properties: {},
                    headers: {
                        default: new Header({
                            children: [new Paragraph({text:"IDELLE'S", alignment: AlignmentType.RIGHT})],
                        }),
                    },
                    children: temp_data.map((item)=>{
                            new TextRun({
                            text:item.id, 
                            size:"25"
                        }) 
                     })
                    // title,
                    // _sub_title,
                    // _sub_title1,
                    // _sub_title2,
                    // _sub_title3,
                    //_sub_title4,
                        //header,
                        // table,
                        // _footer,
                        // _receive_footer,
                        // _balance_footer
                    //],
                });   
                return doc;
        },
        export_data_stockin(item,doc1){ 
                const table = new Table({
                    rows: item.map((item)=>{
                        return new TableRow({
                            children:[
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: item.supp_name,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({bold: true, text: item.panel_name, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.name, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.price, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.quantity, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: 'P ' +this.separator_thousand(item.total) , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                            ],  
                        });
                    }),
                });
                const heading = ["Vendor","Agent", "Description", "Price","Quantity","Subtotal"];
                const total = ["","","","", "Total", 'P '+this.separator_thousand(this._get_total_group(item))];
                const header = this.heading(heading);
                const _footer = this.footer(total);
                const title = new Paragraph({
                children:[new TextRun({  
                        text: "Stock - In",
                        heading: HeadingLevel.HEADING_1,
                        bold:true,
                        color:"140b05",
                        size:"50",  
                    }),], 
                alignment: AlignmentType.RIGHT
                });  
                doc1.addSection({
                    properties: {},
                    headers: {
                        default: new Header({
                            children: [new Paragraph({text:"IDELLE'S", alignment: AlignmentType.RIGHT})],
                        }),
                    },
                    children: [
                    title,
                        header,
                        table,
                        _footer
                    ],
                });  
            return doc1; 
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
        async summary_stock_in(temp){
            console.log(temp)
            let invent = (await this.get_product());
            forEach(invent.data,(invents)=>{
                invents.in = 0;
                invents.total_pay = 0;
            });
            forEach(invent.data,(invents)=>{
                forEach(temp.data, (item)=>{
                    var temp_data = JSON.parse(item.data);
                    forEach(temp_data,(prod)=>{
                        if(invents.product_id == prod.product_id){
                            invents.in += parseInt(prod.quantity);
                            invents.total_pay += parseInt(prod.total);
                        } 
                    })
            }); 
            });
            console.log(invent);
            this.summary_stock_out_doc(invent.data);
            },
        summary_stock_out_doc(items){
            var doc = new Document(); 
            var grand_total = 0;
                const table = new Table({
                    rows: items.map((item)=>{
                        grand_total += parseInt(item.total_pay);
                        return new TableRow({
                            children:[
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: item.description,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({bold: true, text: item.price, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.in.toString(), heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: 'P ' +this.separator_thousand(item.total_pay) , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                            ],  
                        });
                    }),
                });
                const heading = ["Name","Price", "Quantity", "Total"];
                var totalsssss = ["","", "Total Amount", 'P '+this.separator_thousand(grand_total)];
                const header = this.heading(heading);
                const _footer = this.footer(totalsssss); 
                const title = new Paragraph({
                children:[new TextRun({  
                        text: "Stock - IN",
                        heading: HeadingLevel.HEADING_1,
                        bold:true,
                        color:"140b05",
                        size:"50",  
                    }),], 
                alignment: AlignmentType.RIGHT
                });  
                doc.addSection({
                    properties: {},
                    headers: {
                        default: new Header({
                            children: [new Paragraph({text:"IDELLE'S", alignment: AlignmentType.RIGHT})],
                        }),
                    },
                    children: [
                        title, 
                        header,
                        table,
                        _footer,
                    ],
                });  

                Packer.toBlob(doc).then((blob) => {
                console.log(blob);
                saveAs(blob,"Summary.docx");
            });
        },
        _get_total_group(group){
            var temp_total = 0;
            forEach(group, (item)=>{
                temp_total = item.total + temp_total;
            }); 
            return temp_total;
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
.temp_button{
    font-size: 40px !important;
    width: 500px;
    height: 80px !important;
}
.report{
      height: 100%;
  background: white;
}
</style>