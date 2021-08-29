<template> 
    <div class="stockCus"> 
       <div class="text-center" v-if="progress">
         <v-progress-circular 
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>
       </div>
        <div v-else> 
            <div> 
                <v-card class="d-flex mb-6"  flat tile > 
                 <h1>Customer History</h1> 
                <v-btn  class="pa-2 ma-2 "  color="primary" dark @click="export_data">
                    Export
                </v-btn> 
                </v-card>
            </div>
           <hr>  
            <v-simple-table fixed-header height="500px" v-if="data.length > 0">
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th class="text-left"><h2>Date Transaction</h2></th>
                        <th class="text-left"><h2>Customer Name</h2></th>
                        <th class="text-left"><h2>Panel Name</h2></th>
                        <th class="text-left"><h2>Total Pay</h2></th>
                        <th><h2>Amount Received</h2></th> 
                        <th style="text-align:right;"><h2>Balance</h2></th> 
                        <th style="text-align:right;"><h2>Action</h2></th> 
                        <th style="text-align:right;"><h2>Open</h2></th> 
                        <!-- <th ><h2>Delete</h2></th> -->
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in data"
                        :key="item.name"
                        class="font-weight-regular"
                    >   
                        <td>{{ item.date }}</td>
                        <td>{{ item.Customer.name }}</td>
                        <td>{{ item.Track.name }}</td> 
                        <td><h3>{{ 'P '+separator_thousand(item.total_amount) }}</h3></td> 
                        <td><h3>{{ 'P ' +payment(item) }}</h3></td> 
                        <td style="text-align:right;"><h3>{{ 'P ' +balance(item) }}</h3></td>  
                        <td  style="text-align:right;"> <v-btn dark small color="cyan" @click="open_payment(item)" :disabled="balance(item) === '0'">
                            Pay
                        </v-btn>   
                        </td>
                        <td>
                        <!-- <v-btn dark small color="red" @click="open_delete(item)">
                            Return
                        </v-btn> -->
                        <v-btn dark small color="red" route :to="{name: 'Stockoutview', params: {stockout_id: item.stockout_id}}">
                                View
                            </v-btn>
                        </td>
                    </tr> 
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><h1>Total Balance</h1></td> 
                        <td style="text-align:right; text-decoration-line: underline; text-decoration-style: double;"><h1>{{'P '+separator_thousand(total_balance)}}</h1></td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table> 
            <center v-else><h2> No History </h2></center>
        </div>
       <v-row>
            <v-dialog v-model="dialog.payment" persistent max-width="500px">
            <v-card>
            <v-card-title>
                <span class="headline">Pay Off</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" md="12">
                            <h3>Balance: {{payment_method.balance}}</h3>
                        </v-col> 
                        <v-col cols="12" md="12">
                        <v-text-field
                            label="Amount"
                            required 
                            type="number"
                            v-model="amount_pay_off"
                            :rules="[ (value) => { return (genericRequiredRule(value)) }]"
                        ></v-text-field>
                        </v-col> 
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="white darken-1" @click="dialog.payment = false">
                Close
                </v-btn>
                <v-btn color="cyan darken-1" @click="pay_button"> Pay </v-btn>
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
                    Are you sure you want to delete this payment?
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
                    @click="delete_payment()"
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
import axios from 'axios';
import Helper from "../views/helper/helper.js";
import indexOf from "lodash/indexOf";
import find from "lodash/find";
// import forEach from "lodash/forEach";
import {saveAs} from "file-saver";
import { Document, Packer, Paragraph, Table,TableRow, TableCell, WidthType, VerticalAlign,HeadingLevel,AlignmentType } from "docx";
export default {
  mixins:[Helper],
    data: () => ({
        data:{}, 
        progress:true,
        total_balance:0,
        dialog:{
            payment:false,
            delete:false,
        },
        cheker_balance:0, 
        amount_pay_off:0,
        selected:{},
        payment_method:{}
    }),
created(){
     this.get_data();
},
methods:{
    async get_data(){
        let id = this.$route.params.customer_id;
        let temp = await axios.get(this.ipaddress+'/api/stockcustomer/'+id); 
        this.progress = false;
        this.data = temp.data; 
        await this.get_total_bal();
    },
    payment(item){
        let payment = JSON.parse(item.data);
        return this.separator_thousand(parseInt(payment.payment_method.payment));
    },
    balance(item){
        let payment = JSON.parse(item.data); 
        return this.separator_thousand(parseInt(payment.payment_method.balance));
    },
    async get_total_bal(){
        this.total_balance = 0;
        for(var x = 0; x < this.data.length; x++){
         let temp = JSON.parse(this.data[x].data);
         this.total_balance = parseInt(temp.payment_method.balance) + this.total_balance;
        }
    },
    genericRequiredRule(v){  
        if (!isNaN(parseFloat(v)) && v >= 1 && v <= this.cheker_balance) return true;
        return 'Number has to be between 0 and '+ this.cheker_balance;
    },
    open_payment(item){ 
        this.dialog.payment = true;
        this.selected = item;
        let payment = JSON.parse(item.data); 
        this.payment_method = payment.payment_method; 
        this.cheker_balance = parseInt(payment.payment_method.balance);
    }, 
    open_delete(item){
        this.dialog.delete = true;
        console.log(item); 
        this.selected = this.assign(item)
    },
    delete_payment(){ 
      axios.delete("http://127.0.0.1:3308/api/stockdelete/" + this.selected.id).then((response) => {
          console.log(response)
          this.data.splice(indexOf(this.data,
              find(this.data, (x) => {
                return x.id === this.selected.id;
              })
            ),
            1
          ); 
          this.dialog.delete = false; 
          this.toast('Successfully deleted!','error');  
        this.get_total_bal();
        })
        .catch((error) => {
          console.log("Error in " + error); 
        });
    },
    pay_button(){
        if(this.amount_pay_off > this.payment_method.balance){ 
          this.toast('Something went wrong','error'); 
        }else{  
            let temp = JSON.parse(this.selected.data);
            console.log(temp)
            let new_balance = this.payment_method.balance - this.amount_pay_off;
            this.payment_method.balance = new_balance; 
            this.payment_method.payment = parseInt(this.payment_method.payment) + parseInt(this.amount_pay_off);
            temp.payment_method = this.payment_method;
            this.selected.data = JSON.stringify(temp); 
            axios.put(this.ipaddress+"/api/editstockout", this.selected).then((response) => { 
            console.log(response.data); 
            this.dialog.payment = false; 
            this.get_total_bal(); 
            this.toast('Successfully paid!','info');
          
        })
        .catch((error) => {
          console.log("Error in " + error);  
          this.toast('Something went wrong','error');  
        });
        }
    },
    async export_data(){
        // Create document
        const doc = new Document(); 
        // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
        // This simple example will only contain one section
            const table = new Table({
                rows: this.data.map((item)=>{
                    return new TableRow({
                        children:[
                            new TableCell({  
                                width: { size: 100 / this.data.length, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                heading: HeadingLevel.HEADING_1,
                                children: [new Paragraph({ size: 100, bold: true, text: item.date,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                            }),
                            new TableCell({  
                                width: { size: 100 / this.data.length, type: WidthType.PERCENTAGE },
                              children: [new Paragraph({ size: 100, bold: true, text: item.Track.name, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                            }),
                            new TableCell({  
                                 width: { size: 100 / this.data.length, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({size: 20, bold: true, text: 'P '+this.separator_thousand(item.total_amount), heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                            }),
                            new TableCell({  
                                 width: { size: 100 / this.data.length, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({size: 20, bold: true, text: 'P ' +this.payment(item) , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                            }),
                            new TableCell({  
                                 width: { size: 100 / this.data.length, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({size: 20, bold: true, text: 'P ' +this.balance(item)  , heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                            }) 
                        ],  
                    });
                }),
            });
            const heading = ["Date","Panel", "Total Pay", "Amount Received", "Balance"];
            const total = ["","","", "Total Balance", 'P '+this.separator_thousand(this.total_balance)];
            const header = this.heading(heading);
            const _footer = this.footer(total);
            const title = new Paragraph({
                text: "Customer History",
                heading: HeadingLevel.HEADING_1,
            });
            const _customer = new Paragraph({
                text: "Customer Name: "+ this.data[0].Customer.name,
                heading: HeadingLevel.HEADING_1,
            }); 
        doc.addSection({
            properties: {},
            children: [
                title,
                _customer, 
                header,
                table,
                _footer
            ],
        });  
        // Used to export the file into a .docx file
        Packer.toBlob(doc).then((blob) => {
            console.log(blob);
            saveAs(blob,"Document.docx");
        }); 
        // Done! A file called 'My Document.docx' will be in your file system. 
    }
}
}
</script>
<style>
.test { 
  margin-right: 400px;    
  border-style: solid;
  border-color: coral; 
  background-color:white;
}
.stockCus{ 
    padding: 10px;
    height: 100%;
    background-color: white !important;
}
p{
  font-size: 20px;
}
 
</style>