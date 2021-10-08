<template>
    <div class="cat pa-md-4">
        <v-card> 
            <div> 
                <v-card class="d-flex"  flat tile > 
                    <h2  class="ml-5 mr-auto mt-2">Billing Management</h2> 
                    <v-btn  class="pa-2 ma-2 "  color="warning" rounded @click="dialog.create=true">
                        Add Billing
                    </v-btn> 
                </v-card>
            </div>
            <hr>
            <div>
                <v-pagination circle></v-pagination>
            </div>  
            <v-card class="pa-md-2"> 
                <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            <h3>Table Number</h3>
                        </th>
                        <th class="text-left">
                            <h3>Order Number</h3>
                        </th>
                        <th class="text-left">
                            <h3>Order Date</h3>
                        </th>
                        <th class="text-left">
                            <h3>Order Time</h3>
                        </th>
                        <th class="text-left">
                            <h3>Cashier</h3>
                        </th>
                        <th class="text-left">
                            <h3>Action</h3>
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data" :key="item.name" >
                        <td>{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-card>
        
      
    </div>
    
</template>
<script>

export default ({
    setup() {
        
    },
    data:()=>({
        headers:["Category Name","Status","Action"]
    })
})
</script>
<style scoped>
.cat{
  height: 100%;
  background: white;
}
 
</style>
