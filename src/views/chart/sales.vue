<template> 
    <div id="chart" >
    <v-row class="ml-3 mr-3">
      <!-- <v-col cols="12" md="3"><v-card>
        <v-card-title>
         <h2>200</h2>
        </v-card-title> 
        <v-card-subtitle>
          Items
        </v-card-subtitle>
      </v-card></v-col> -->
      <v-col cols="12" md="4"><v-card class="box">
        <apexcharts type="area" height="150" width="100%" :options="chartOptionsSales" class="sales" :series="seriesSales" ></apexcharts>
      </v-card></v-col>
      <v-col cols="12" md="4"><v-card>
         <apexcharts type="area" height="150" width="100%" :options="chartOptionsSales" class="sales" :series="seriesSales" ></apexcharts>
      </v-card></v-col>
      <v-col cols="12" md="4"><v-card>
        <apexcharts type="area" height="150" width="100%" :options="chartOptionsProfit" class="sales" :series="seriesProfit" ></apexcharts>
      </v-card></v-col>
    </v-row> 
    </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts';
export default ({
    setup() {
        
    },
    data:()=>({
        seriesSales: [{
              name: "Sales",
              data: [10, 3, 12, 5, 14, 8, 16]
          }],
        chartOptionsSales:{
             chart: {  
                type: 'area',
                height: 60,
                sparkline: {
                enabled: true
                },
            },
            stroke: {
                curve: 'straight'
            },
            fill: {
                opacity: 1,
            },
            title: {
                text: '$424,652',
                offsetX: 30,
                style: {
                fontSize: '24px',
                cssClass: 'apexcharts-yaxis-title'
                }
            },
            subtitle: {
                text: 'Sales',
                offsetX: 30,
                style: {
                fontSize: '14px',
                cssClass: 'apexcharts-yaxis-title'
                }
            }, 
             yaxis: {
                min: 0
            },
            xaxis: {
              categories: ['Mon', 'Teu', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'], 
            },
            colors: ['#DCE6EC'],
          },
        seriesProfit: [{
              name: "Sales",
              data: [10, 3, 12, 5, 14, 8, 16]
          }],
        chartOptionsProfit:{
             chart: {  
                type: 'area',
                height: 60,
                sparkline: {
                enabled: true
                },
            },
            stroke: {
                curve: 'straight'
            },
            fill: {
                opacity: 1,
            },
            title: {
                text: '$424,652',
                offsetX: 30,
                style: {
                fontSize: '24px',
                cssClass: 'apexcharts-yaxis-title'
                }
            },
            subtitle: {
                text: 'Profits',
                offsetX: 30,
                style: {
                fontSize: '14px',
                cssClass: 'apexcharts-yaxis-title'
                }
            }, 
             yaxis: {
                min: 0
            },
            xaxis: {
              categories: ['Mon', 'Teu', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'], 
            },
            colors: ['#008FFB'],
          },  
            
          
          
    }),
    components:{
       apexcharts: VueApexCharts,  
    }
})
</script>
<style>
    /* g#SvgjsG1022 {
        display: none;
    } */
    /* g#SvgjsG1047{
        display: none;
    }
    g#SvgjsG1063 {
    display: none;
    }
    g#SvgjsG1062 {
    display: none;
    } */
    .box {
        box-shadow: 0px 1px 22px -12px #607D8B;
        background-color: #fff;
        /* padding: 25px 35px 25px 30px; */
        }

    #chart {
            width: '50%'
        }
     
</style>
