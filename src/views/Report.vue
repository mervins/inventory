<template>
    <div class="report">
        <div>
            <v-toolbar dark flat > 
            <!-- <v-toolbar-title>Reports</v-toolbar-title>  -->
            <!-- <v-spacer></v-spacer>  -->
        
            <template >
                <v-tabs v-model="tab" align-with-title >
                <v-tabs-slider color="primary"></v-tabs-slider> 
                <v-tab v-for="item in items" :key="item" >
                    {{ item }}
                </v-tab>
                </v-tabs>
            </template>
            </v-toolbar> 
            <v-tabs-items v-model="tab">
            <v-tab-item  v-for="item in items" :key="item" >
                <v-card flat>
                <v-card-text v-if="tab == 0">
                    <ListReports></ListReports>
                </v-card-text>
                <v-card-text v-if="tab == 1">
                    <GenerateReports></GenerateReports>
                   
                </v-card-text>
                </v-card>
            </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>
<script> 
import GenerateReports from '../views/report/GenerateReport.vue' 
import ListReports from '../views/report/ListReports.vue';
export default { 
    components: {
          GenerateReports,
          ListReports 
        },
    data:() => ({
        tab: null,
        items: ['Generate Report', 'Reports'],
      
    }),
  
   
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