<template> 
    <div class="test">
       <div class="text-center" v-if="progress">
         <v-progress-circular 
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>
       </div>
        <v-container v-else>
          <div> 
            <v-card class="d-flex"  flat tile > 
              <h1>Stock - In</h1> 
            <v-btn  class="pa-2 ma-2 "  color="primary" dark @click="export_data">
                Export
            </v-btn> 
            </v-card>
            </div>
           <v-row>
               <v-col cols="12" md="4">
                 <p> Panel Name: <b>{{data[0].Track.name}}</b> <v-spacer></v-spacer> Agent: <b><b>{{data[0].Track.agent}}</b></b> </p>
                </v-col>
                <v-col cols="12" md="4">
                   <p> Supplier Name: <b>{{data[0].Supplier.name}}</b> <v-spacer></v-spacer> Address: <b><b>{{data[0].Supplier.address}}</b></b> </p>
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
           <hr>
            <v-simple-table fixed-header height="500px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"><h2>Description</h2></th>
            <th class="text-left"><h2>Price</h2></th>
            <th class="text-left"><h2>Qunatity</h2></th>
            <th style="text-align:right;"><h2>Sub Total</h2></th> 
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.name"
            class="font-weight-regular"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td style="text-align:right;"><h3>{{ 'P '+separator_thousand(item.total) }}</h3></td>  
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style="text-align:right;"><h1>Total Amount</h1></td> 
            <td><h2 style="text-align:right;">{{ 'P '+separator_thousand(data[0].total_amount)}}</h2></td> 
          </tr>
        </tbody>
      </template>
    </v-simple-table> 
        </v-container>
    </div> 
</template>
<script>
import axios from 'axios';
import Helper from "../views/helper/helper.js";
// import forEach from "lodash/forEach";
import {saveAs} from "file-saver";
import { Document, Packer, Paragraph, Table,TableRow, TableCell, WidthType,HeadingLevel,AlignmentType,TextRun,Header } from "docx";
export default {
  mixins:[Helper],
    data: () => ({
        data:{},
        items:[],
        progress:true
    }),
created(){
     this.get_data();
     this.date_today();
},
methods:{
    async get_data(){
        let id = this.$route.params.stockin_id;
        let temp = await axios.get(this.ipaddress+'/api/stockinview/'+id);
        this.data = temp.data;
        this.items = JSON.parse(this.data[0].data); 
        this.progress = false
    }, 
    async export_data(){
        // Create document
        const doc = new Document(); 
        // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
        // This simple example will only contain one section
            const table = new Table({
                rows: this.items.map((item)=>{
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
                        text: "Supplier Name: "+ this.data[0].Supplier.name, 
                        size:"25"
                    }),
                    ],
                });
            const _sub_title3 = new Paragraph({
                children: [  
                    new TextRun({
                        text: "Supplier Address: "+ this.data[0].Supplier.address, 
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
                    _footer
                ],
            });  
        // Used to export the file into a .docx file
        Packer.toBlob(doc).then((blob) => {
            console.log(blob);
            saveAs(blob,"Document.docx");
        }); 
        // Done! A file called 'My Document.docx' will be in your file system. 
    }, 
}
}
</script>
<style>
.test { 
  margin-right: 400px;    
  border-style: solid;
  border-color: coral;
}
.test{
    margin:100px;
}
p{
  font-size: 20px;
}
</style>