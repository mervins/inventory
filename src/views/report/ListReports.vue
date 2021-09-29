<template>
    <div class="center"> 
        <h3>List Reports</h3>
        <div class="text-center">
            <v-pagination @input="initializeReports"  v-model="current_page" :length="totalPages.length-1" circle></v-pagination>
        </div>
        <v-dialog transition="dialog-bottom-transition" max-width="900" >
            <template v-slot:activator="{ on, attrs }"> 
            <v-simple-table fixed-header>
                <template v-slot:default>
                    <thead>
                    <tr> 
                        <th class="text-left"><h2>Date</h2></th>
                        <th class="text-left"><h2>Action</h2></th> 
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,key) in reports" :key="key" class="font-weight-regular">
                        <td><h3>{{ item.date }}</h3></td> 
                        <td> 
                            <v-btn depressed route color="primary"  class="mt-1 ml-2 mr-2" v-bind="attrs" v-on="on" @click="viewReports(key)">
                                View
                            </v-btn>
                            <v-btn depressed color="primary" class="mt-1 ml-2 mr-2" @click="printReports(key)">
                                Print Report
                            </v-btn>
                            <v-btn depressed color="primary" class="mt-1 ml-2 mr-2" @click="printInventory(key)">
                                Print Inventory
                            </v-btn>
                            <v-btn depressed color="error" class="mt-1 ml-2 mr-2" @click="delete_war(item)">
                                Delete
                            </v-btn>
                            </td> 
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>  
            </template>
            <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary center" dark >Reports</v-toolbar>
                <div>
                   <div>
                    <v-toolbar dark flat >   
                    <template >
                        <v-tabs v-model="tab" align-with-title >
                        <v-tabs-slider color="primary"></v-tabs-slider> 
                        <v-tab v-for="item in tabs" :key="item" >
                            <b>{{ item }}</b>
                        </v-tab>
                        </v-tabs>
                    </template>
                    </v-toolbar> 
                    <v-tabs-items v-model="tab">
                        <v-tab-item  v-for="item in tabs" :key="item" > 
                                <TablesView :revenue="revenue" :expenses="expenses" :profit="profits" :tab="tab" :inventory="inventory"></TablesView> 
                        </v-tab-item>
                    </v-tabs-items>
                </div>
                </div>
                <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false" >Close</v-btn>
                </v-card-actions>
            </v-card>
            </template>
        </v-dialog>
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


import {saveAs} from "file-saver"; 
import Helper from "../helper/helper.js";
import forEach from "lodash/forEach";
import axios from 'axios';
import { Document, Packer, Paragraph, Table,TableRow, TableCell, WidthType,HeadingLevel,AlignmentType,TextRun,Header,PageOrientation } from "docx";
import TablesView from '../report/ViewReport.vue';
export default ({
    mixins:[Helper],
    components:{
        TablesView
    },
    setup() {
        
    }, 
    data:()=>({
        reports:{},
        totals:{},
        current_page:1, 
        totalPages:[],
        tabs: ['Profits', 'Revenue', 'Expenses','Inventory'],
        tab:0,
        revenue:[],
        profits:{},
        expenses:[],
        inventory:[],
        dialog:{
            delete:false
        }
    }),
    created(){
        this.initializeReports()
    },
    methods:{
        async initializeReports(){
             let temp_data = await axios.get(this.ipaddress+'/api/reports?page='+(this.current_page-1)+'&size=10'); 
              this.reports = temp_data.data.rows; 
                this.totalPages=[];
                let data_temp = temp_data.data;  
                for(let x = 0; x <= data_temp.totalPages; x++){
                    this.totalPages.push(x);
                }   
        },
        printReports(index){
            var tempSold = JSON.parse(this.reports[index].data_sold); 
            var tempExpenses = JSON.parse(this.reports[index].data_expense); 
            var tempReport =JSON.parse(this.reports[index].data_report); 
            var checkTempExpenses = [];
            if (tempExpenses.length === 0) { checkTempExpenses =  [{desc:'none',cost:"0"}] }
            else{ checkTempExpenses = tempExpenses }
           console.log(checkTempExpenses);
            var doc = new Document();  
                doc = this.export_data_stockin(tempSold,checkTempExpenses,tempReport,doc)
                Packer.toBlob(doc).then((blob) => { 
                    saveAs(blob,"Stockin.docx");
            }); 
        },
        printInventory(index){ 
            console.log(JSON.parse(this.reports[index].data_inventory))
            var inventory = JSON.parse(this.reports[index].data_inventory);  
            if(inventory.length === 0){ alert('No Inventory Available') }
            else{
                var doc = new Document();  
                doc = this.exportInventory(inventory,doc)
                Packer.toBlob(doc).then((blob) => { 
                    saveAs(blob,"Inventory.docx");
                }); 
             }
            
            
        },
        exportInventory(inventory,doc){
             const table1 = new Table({
                    rows: inventory.map((item)=>{
                        return new TableRow({
                            children:[
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: item.description,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({bold: true, text:item.begInv.toString(), heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.sold.toString(), heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.stock, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                            ],  
                        });
                    }),
                });

                //this.separator_thousand(this._get_total_group(sold)); 
                const heading1 = ["Description","Starting Inentory", "SOLD", "ENDING INVENTORY"]; 
                //const total = ["Total",this.totals.invest.toString(),"","", 'P '+ this.totals.tA.toString()];
                const header1 = this.heading(heading1); 
                //const _footer = this.footer(total);
                const title1 = new Paragraph({
                children:[new TextRun({  
                        text: "INVENTORY",
                        heading: HeadingLevel.HEADING_1,
                        bold:true,
                        color:"140b05",
                        size:"25",  
                    }),], 
                alignment: AlignmentType.LEFT
                });  
                doc.addSection({
                    properties: {},
                    size: {
                        orientation: PageOrientation.LANDSCAPE,
                    },
                    headers: {
                        default: new Header({
                            children: [new Paragraph({text:"IDELLE'S", alignment: AlignmentType.RIGHT})],
                        }),
                    },
                    children: [
                        title1,
                        header1, 
                        table1,
                        //_footer 
                    ],
                });   
             return doc; 
        },
        export_data_stockin(sold,expenses,report,doc1){ 
                var tempReport = report;
                const table1 = new Table({
                    rows: [ new TableRow({
                            children:[
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: tempReport.investment.toString(),heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: tempReport.totalExpenses.toString() , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }), 
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: tempReport.total_amount.toString(),heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: tempReport.gross_profit.toString() , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }), 
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: tempReport.net_profit.toString() , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }), 
                            ],  
                        }),
                    ],
                });

                const table2 = new Table({
                    rows: sold.map((item)=>{
                        return new TableRow({
                            children:[
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: item.description,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({bold: true, text: parseInt(item.original_price * item.qty).toString(), heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.qty.toString(), heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: item.price, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({bold: true, text: parseInt(item.price * item.qty).toString(), heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }), 
                            ],  
                        });
                    }),
                });
                const table3 = new Table({
                    rows: expenses.map((item)=>{
                        return new TableRow({
                            children:[
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: item.desc,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({bold: true, text: item.cost , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }), 
                            ],  
                        });
                    }),
                });
                this.separator_thousand(this._get_total_group(sold)); 
                const heading1 = ["INVEST","EXPENSES", "TOTAL", "GROSS PROFIT","NET PROFIT"];
                const heading2 = ["ITEM NAME","INVESTMENT", "QUANTITY", "AMOUNT","TOTAL AMOUNT"];
                const heading3 = ["DESCRIPTION","COST"];
                const total = ["Total",this.totals.invest.toString(),"","", 'P '+ this.totals.tA.toString()];
                const header1 = this.heading(heading1);
                const header2 = this.heading(heading2);
                const header3 = this.heading(heading3);
                const _footer = this.footer(total);
                const title1 = new Paragraph({
                children:[new TextRun({  
                        text: "PROFITS",
                        heading: HeadingLevel.HEADING_1,
                        bold:true,
                        color:"140b05",
                        size:"25",  
                    }),], 
                alignment: AlignmentType.LEFT
                }); 
                const title2 = new Paragraph({
                children:[new TextRun({  
                        text: "REVENUE",
                        heading: HeadingLevel.HEADING_1,
                        bold:true,
                        color:"140b05",
                        size:"25",  
                    }),], 
                alignment: AlignmentType.LEFT
                }); 
                const title3 = new Paragraph({
                children:[new TextRun({  
                        text: "Expenses",
                        heading: HeadingLevel.HEADING_1,
                        bold:true,
                        color:"140b05",
                        size:"25",  
                    }),], 
                alignment: AlignmentType.LEFT
                });
                doc1.addSection({
                    properties: {},
                    size: {
                        orientation: PageOrientation.LANDSCAPE,
                    },
                    headers: {
                        default: new Header({
                            children: [new Paragraph({text:"IDELLE'S", alignment: AlignmentType.RIGHT})],
                        }),
                    },
                    children: [
                        title1,
                        header1, 
                        table1,
                        title2,
                        header2,
                        table2, 
                        _footer,
                        title3,
                        header3,
                        table3
                    ],
                });   
             return doc1; 
        },
        _get_total_group(group){
            var temp_totalTA = 0;
            var temp_totalInves = 0;
            forEach(group, (item)=>{
                var totalP = parseFloat(item.price*item.qty)
                var totalI = parseFloat(item.original_price*item.qty)
                temp_totalTA = totalP + temp_totalTA;
                temp_totalInves = totalI + temp_totalInves;
            }); 
            console.log(temp_totalInves + ' ' + temp_totalTA)
            this.totals = {tA:temp_totalTA, invest:temp_totalInves}; 
            console.log( this.totals );
        },
        viewReports(index){ 
                this.revenue = JSON.parse(this.reports[index].data_sold); 
                this.expenses = JSON.parse(this.reports[index].data_expense); 
                this.profits = JSON.parse(this.reports[index].data_report); 
                this.inventory = JSON.parse(this.reports[index].data_inventory)
                console.log(this.inventory);
        },
        delete_war(item){
            this.dialog.delete = true;
            this.selected = item;
            },
            async deleteTrans(){
                const data = this.reports.indexOf(this.selected);
                this.reports.splice(data,1); 
            let temp_data =  await axios.delete(this.ipaddress+'/api/deleteReports/' +this.selected.id); 
            if(temp_data.data == 'success'){ 
                const data = this.reports.indexOf(this.selected);
                this.reports.splice(data,1); 
                this.dialog.delete = false;
                this.toast('Success deleted','error');
            }else{
                this.toast('Something went wrong','error');
            } 
            },
        }
})
</script>
