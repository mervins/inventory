<template>
    <div class="report">
        <center>
            <h1>Generate Reports</h1>
            <div style="width:500px;">
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
            </div>
            <div>
                <v-btn  class="pa-2 ma-2 temp_button"  color="primary" dark @click="export_inventory">
                    Inventory List
                </v-btn> 
            </div>
            <div>
                <v-btn  class="pa-2 ma-2 temp_button"  color="primary" dark @click="stock_in">
                    Stock - In
                </v-btn>
            </div>
            <div>
                <v-btn  class="pa-2 ma-2 temp_button"  color="primary" dark @click="stock_out" >
                    Stock - Out
                </v-btn>
            </div>
            <!-- <div>
                <v-btn  class="pa-2 ma-2 temp_button"  color="primary" dark >
                        Sales
                </v-btn>
            </div> -->
        </center>
    </div>
</template>
<script>
import Helper from "../views/helper/helper.js";
import {saveAs} from "file-saver";
import forEach from "lodash/forEach";
import axios from 'axios';
import { Document, Packer, Paragraph, Table,TableRow, TableCell, WidthType,HeadingLevel,AlignmentType,TextRun,Header } from "docx";
export default {
    mixins:[Helper],
    data:() => ({
        inventory:[],
        // stock_in:{},
        stock_out_data:{},
        invents:{},
        date: new Date().toISOString().substr(0, 10),
        summary_SI:[]
    }),
    methods:{ 
        async export_inventory(){
            await this.temp_stock_out();
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
            let temp_debt = [];
            console.log(temp)
            forEach(temp.data, (item)=>{
                let temp = JSON.parse(item.data);    
                forEach(temp.product,(x)=>{   //merge all product from stockout
                        Object.assign(x,{customer:item.Customer.name,panel_name:item.Track.agent}) 
                }); 
                temp_debt.push(Object.assign(temp.payment_method,{customer:item.Customer.name,panel_name:item.Track.agent,total_amount:item.total_amount}) );
                temp_all_trans.push(...temp.product);
            }); 
             console.log(temp_debt) 
            // var doc = new Document(); 
            // // forEach(temp.data, (item)=>{
            // //     doc = this.export_data_stockout(item,doc)
            // // });   
            // doc = this.export_data_stockout(temp_all_trans,doc)
            // Packer.toBlob(doc).then((blob) => {
            //     console.log(blob);
            //     saveAs(blob,"Stockout.docx");
            // });   
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
            var doc = new Document(); 
            //  forEach(temp.data, (item)=>{
            //      doc = this.export_data_stockin(temp_all_trans,doc)
            //  }); 
            doc = this.export_data_stockin(temp_all_trans,doc)
            Packer.toBlob(doc).then((blob) => {
                console.log(blob);
                saveAs(blob,"Stockin.docx");
            }); 
            // await this.summary_stock_in(temp);
        },
        export_data_stockout(item,doc){  
            console.log(item);
             var temp_data = item;
                const table = new Table({
                    rows: temp_data.map((item)=>{
                        return new TableRow({
                            children:[
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text: item.customer,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
                                new TableCell({  
                                    width: { size: 100 / 3, type: WidthType.PERCENTAGE }, 
                                    children: [new Paragraph({bold: true, text:  item.panel_name,heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, })],
                                }),
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
                const heading = ["Customer","Agent", "Description", "Price","Quantity","Subtotal"];
                // const total = ["","","","","", "Total Amount", 'P '+this.separator_thousand(item.total_amount)];
                // const received = ["","", "Amount received", 'P '+this.separator_thousand(temp_data.payment_method.payment)];
                // const balance = ["","", "Total Balance", 'P '+this.separator_thousand(temp_data.payment_method.balance)];
                const header = this.heading(heading);
                // const _footer = this.footer(total);
                // const _receive_footer = this.footer(received);
                // const _balance_footer = this.footer(balance);
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
                const _sub_title4 = new Paragraph({
                    children: [  
                        new TextRun({
                            text: "Date: "+ item.date, 
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
                    // _sub_title,
                    // _sub_title1,
                    // _sub_title2,
                    // _sub_title3,
                    _sub_title4,
                        header,
                        table,
                        // _footer,
                        // _receive_footer,
                        // _balance_footer
                    ],
                });   
                return doc;
        },
        export_data_stockin(item,doc1){
                // var temp_data = JSON.parse(item.data)
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
        //this.temp_stock_out(); 
    },
   
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