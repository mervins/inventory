<template> 
    <div class="stview">
       <div class="text-center" v-if="progress">
         <v-progress-circular 
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>
       </div>
        <v-container v-else>
             <v-card class="d-flex"  flat tile > 
              <h1>Stock - Out</h1> 
            <v-btn  class="pa-2 ma-2 "  color="primary" dark @click="export_data">
                Export
            </v-btn> 
            </v-card>
           <v-row>
               <v-col cols="12" md="4">
                 <p> Panel Name: <b>{{data[0].Track.name}}</b> <v-spacer></v-spacer> Agent: <b><b>{{data[0].Track.agent}}</b></b> </p>
                </v-col>
                <v-col cols="12" md="4">
                   <p> Customer Name: <b>{{data[0].Customer.name}}</b> <v-spacer></v-spacer> Address: <b><b>{{data[0].Customer.address}}</b></b> </p>
                </v-col>
                <v-col cols="12" md="4">
                  Date
                  <v-menu ref="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field  v-model="data[0].date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="data[0].date" no-title scrollable> 
                    </v-date-picker>
                </v-menu>
                </v-col>
           </v-row> 
           <!-- <div class="d-flex flex-row-reverse">
              <v-btn class="pa-2 ma-2 "  color="primary" @click="_update_stockout"> Save  </v-btn>
           </div>  -->
           <hr>
            <v-simple-table fixed-header height="500px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"><h2>Description</h2></th>
            <th class="text-left"><h2>Price</h2></th>
            <th class="text-left"><h2>Qunatity</h2></th> 
            <th style="text-align:right;"><h2>Sub Total</h2></th> 
            <th style="text-align:right;"><h2>Action</h2></th> 
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in items.product" :key="item.name"  class="font-weight-regular">
            <td>{{ item.name }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td style="text-align:right;"><h3>{{ 'P '+separator_thousand(item.total) }}</h3></td>  
            <td style="text-align:right;"> <v-btn dark small color="red" @click="refund(item)"> Return  </v-btn></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><h2>Total Amount</h2></td> 
            <td><h2 style="text-align:right; text-decoration: underline;">{{ 'P '+separator_thousand(items.payment_method.total_amount)}}</h2></td> 
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><h2>Amount received</h2></td> 
            <td><h3 style="text-align:right;">{{ 'P '+separator_thousand(parseInt(items.payment_method.payment))}}</h3></td> 
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><h2>Balance</h2></td> 
            <td><h3 style="text-align:right; text-decoration-line: underline; text-decoration-style: double;">{{ 'P '+separator_thousand(items.payment_method.balance)}}</h3></td> 
          </tr>
        </tbody>
      </template>
    </v-simple-table> 
    </v-container>
    <v-row>
      <v-dialog v-model="dialog.edit" persistent max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">Return Product</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field label="Customer" required disabled type="text" v-model="selected.customer"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="Product*" disabled v-model="selected.name"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" >
                  <v-text-field label="Quantity" persistent-hint type="number"  required v-model="selected.quantity"></v-text-field>
                </v-col> 
                <v-col cols="12" sm="8">
                  <v-text-field label="Reason to return" persistent-hint required v-model="selected.reason"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field label="Receiver" persistent-hint required v-model="selected.receiver"></v-text-field>
                    </v-col> 
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog.edit = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="_addReturn"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    </div> 
</template>
<script>
import forEach from "lodash/forEach";
import axios from 'axios';
import Helper from "../views/helper/helper.js";
import { Document, Packer, Paragraph, Table,TableRow, TableCell, WidthType,HeadingLevel,AlignmentType,TextRun,Header } from "docx";
import {saveAs} from "file-saver";
// import forEach from "lodash/forEach";
export default {
  mixins:[Helper],
    data: () => ({
        data:{},
        items:[],
        progress:true,
        payment_method:{},
        selected:{
          stockout_id:null,
          total_amount:null
        },
        form:{
          stockout_id:null,
          data:{},
          total_amount:null
        },
        dialog:{
          edit:false
        },
        value:{
          max:0,
          min:0
        }
    }),
created(){
     this.get_data();
},
methods:{
  setMax(){
    if(this.selected.quantity > this.value.max){
      this.selected.quantity = this.value.max
    }
  },
  refund(item){ 
    this.dialog.edit = true;
    this.selected = this.assign(item);
    Object.assign(this.selected,{customer:this.data[0].Customer.name}) 
    this.value.max = this.selected.quantity; 
    console.log(this.selected);
    // this.items.product.splice(this.items.product.indexOf(item),1);
    // this.selected.stockout_id = this.$route.params.stockout_id;
    // this.selected.total_amount =  this.reCompute();
    // this.selected.data = JSON.stringify(this.items); 
    // this._update_stockout();
  },
  _addReturn(){  
      axios.put(this.ipaddress+"/api/addReturn", this.selected).then((response) => {
           console.log(response);
           this.toast('Successfully returned!','info'); 
        })
        .catch((error) => {
          console.log("Error in " + error); 
           this.dialog.edit = false;  
        });
    },
  reCompute(){
    let total = 0; 
    forEach(this.items.product, (item)=>{
      total = item.total + total;
    }) 
    var tempBal = total - parseInt(this.items.payment_method.payment);  
    this.items.payment_method.balance = tempBal > 0 ? tempBal : 0;
    this.items.payment_method.payment = total;
    this.items.payment_method.total_amount = total; 
    return total;
  },
    async get_data(){
        let id = this.$route.params.stockout_id;
        let temp = await axios.get(this.ipaddress+'/api/stockoutview/'+id);
        this.data = temp.data;
        this.items = JSON.parse(this.data[0].data); 
        this.items.payment_method.total_amount = parseInt(this.data[0].total_amount);
        this.progress = false
    },
    export_data(){  
        const doc = new Document();  
            const table = new Table({
                rows: this.items.product.map((item)=>{
                    return new TableRow({
                        children:[
                            new TableCell({  
                                width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                children: [new Paragraph({bold: true, text: item.name,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
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
            const heading = ["Name","Price", "Quantity", "Total"];
            const total = ["","", "Total Balance", 'P '+this.separator_thousand(this.data[0].total_amount)];
            const received = ["","", "Amount received", 'P '+this.separator_thousand(this.items.payment_method.payment)];
            const balance = ["","", "Amount received", 'P '+this.separator_thousand(this.items.payment_method.balance)];
            const header = this.heading(heading);
            const _footer = this.footer(total);
            const _receive_footer = this.footer(received);
            const _balance_footer = this.footer(balance);
            const title = new Paragraph({
              children:[new TextRun({  
                    text: "Stock - Out",
                    heading: HeadingLevel.HEADING_1,
                    bold:true,
                    color:"140b05",
                    size:"50",  
                }),], 
              alignment: AlignmentType.RIGHT
            }); 
            const _sub_title = new Paragraph({
                children: [ 
                    new TextRun({
                        text: "Panel Name: " + this.data[0].Track.name, 
                        size:"25",  
                    }),  
                    ], 
                });
            const _sub_title1 = new Paragraph({
                children: [ 
                    new TextRun({
                        text: "Panel Agent: " + this.data[0].Track.agent, 
                        size:"25"
                    }), 
                    ],
                });
            const _sub_title2 = new Paragraph({
                children: [  
                    new TextRun({
                        text: "Customer Name: "+ this.data[0].Customer.name, 
                        size:"25"
                    }),
                    ],
                });
            const _sub_title3 = new Paragraph({
                children: [  
                    new TextRun({
                        text: "Customer Address: "+ this.data[0].Customer.address, 
                        size:"25"
                    }),
                    ],
                });
            const _sub_title4 = new Paragraph({
                children: [  
                    new TextRun({
                        text: "Date: "+ this.data[0].date, 
                        size:"25"
                    }),
                    ],
                    thematicBreak:true
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
                  _sub_title,
                  _sub_title1,
                  _sub_title2,
                  _sub_title3,
                  _sub_title4,
                    header,
                    table,
                    _footer,
                    _receive_footer,
                    _balance_footer
                ],
            });  
        // Used to export the file into a .docx file
        Packer.toBlob(doc).then((blob) => {
            console.log(blob);
            saveAs(blob,"Stockout.docx");
        }); 
        // Done! A file called 'My Document.docx' will be in your file system. 
    }, 
}
}
</script>
<style>
 
.stview{
    padding:10px;
    height: 100%;
    background-color: white !important;
}
p{
  font-size: 20px;
}
</style>