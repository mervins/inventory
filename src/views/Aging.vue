<template>
  <div class="aging">
    <div> 
    <v-card class="d-flex mb-6"  flat tile > 
      <h1  class="ml-5 mr-auto">Aging Customer</h1>   
    </v-card>
  </div> 
    <br />
    <hr /> 
    <v-simple-table fixed-header height="500px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"><h2>Name</h2></th>
            <th class="text-left"><h2>Address</h2></th>
            <th class="text-left"><h2>Contact Number</h2></th> 
            <th class="text-left"><h2>Action</h2></th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,key) in customer" :key="key" class="font-weight-regular "> 
              <td >{{ item.name }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.contact }}</td> 
              <td>
                <v-btn dark small color="cyan" route :to="{name: 'Stockcustomer', params: {customer_id: item.customer_id}}">
                  Open
                </v-btn> 
              </td> 
          </tr> 
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>
<script>
import axios from 'axios'; 
import Helper from "../views/helper/helper.js"
export default {
  mixins:[Helper],
  data: () => ({
    dialog:{
      create: false,
      edit:false,
      delete:false
    },
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    form:{
        name:'',
        address:'',
        contact:'', 
    },
    selected:{},
    customer:[]
  }),
  methods:{ 
      async getdata(){ 
        let temp_data =  await axios.get(this.ipaddress+'/api/customer');
        this.customer = temp_data.data; 
      },  
      
  },
  created(){
    // let temp_data =  axios.get('http://127.0.0.1:3308/api/customer');
    this.getdata()  
  }
};
</script>
<style>
.sub_main {
  margin: 3px;
}
.taes{
    font-size-adjust: 50px;
}
.aging{
  height: 100%;
  background: white;
}
 
</style>