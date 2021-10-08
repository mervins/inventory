<template>
    <div class="cat pa-md-4">
        <v-card> 
            <div> 
                <v-card class="d-flex"  flat tile > 
                    <h2  class="ml-5 mr-auto mt-2">Category Management</h2> 
                    <v-btn  class="pa-2 ma-2 "  color="warning" rounded @click="modal.add=true">
                        Add Category
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
                            <h3>Category Name</h3>
                        </th>
                        <th class="text-left">
                            <h3>Status</h3>
                        </th>
                        <th class="text-left">
                            <h3>Action</h3>
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data" :key="item.name" >
                        <td>{{ item.name }}</td>
                        <td>
                            <v-btn  class="pa-2 ma-2 "  :color="item.status == '1' ? 'primary' : 'error'" @click="disableBtn(item)">
                                {{item.status == "1" ? 'Enable' : 'Disable'}}
                            </v-btn> </td>
                         <td>
                             <v-btn  class="pa-2 ma-2 "  color="success" rounded @click="_open_edit(item)">
                                Edit
                            </v-btn> 
                             <v-btn  class="pa-2 ma-2 "  color="error" rounded @click="delete_war(item)">
                                Delete
                            </v-btn> 
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-card>
        <v-dialog  max-width="500"  v-model="modal.add" persistent> 
            <template>
            <v-card>
                <v-toolbar color="primary" dark >Add Category</v-toolbar>
                <v-card-text>
                <div class="pt-5">
                   <v-text-field label="Category Name" outlined clearable v-model="form.name"></v-text-field>
                </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                <v-btn text  @click="modal.add = false">Cancel</v-btn>
                <v-btn  class="pl-7 pr-7"  color="warning" rounded @click="addCat">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
            </template>
        </v-dialog>
        <v-dialog  max-width="500"  v-model="modal.edit" persistent> 
            <template>
            <v-card>
                <v-toolbar color="primary" dark >Edit Category</v-toolbar>
                <v-card-text>
                <div class="pt-5">
                   <v-text-field label="Category Name" outlined clearable v-model="selected.name"></v-text-field>
                </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                <v-btn text  @click="modal.edit = false">Cancel</v-btn>
                <v-btn  class="pl-7 pr-7"  color="warning" rounded @click="_update_Cat('name')">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="modal.delete" persistent max-width="390">
            <v-card>
            <v-card-title>
                Are you sure you want to delete this Category?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="modal.delete = false">
                Disagree
                </v-btn>
                <v-btn color="green darken-1" text @click="delete_cat()">
                Agree
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="modal.disableOrEnable" persistent max-width="390">
            <v-card>
            <v-card-title>
                Are you sure you want to {{selected.status == "1" ? 'disable' : 'enable'}}?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="modal.disableOrEnable = false">
                Disagree
                </v-btn>
                <v-btn color="green darken-1" text @click="_update_Cat('status')">
                Agree
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
    
</template>
<script>
import Helper from "../helper/helper.js"
import axios from 'axios'; 
import Vue from "vue"; 
import indexOf from "lodash/indexOf";
import find from "lodash/find";
export default ({
    mixins:[Helper], 
    data:()=>({
        headers:["Category Name","Status","Action"],
        modal:{
            add:false,
            edit:false,
            delete:false,
            disableOrEnable:false
        },
        form:{
            name:''
        },
        data:[],
        selected:{}
    }),
    created(){
        this.initialize()
    },
    methods:{
        disableBtn(item){
            this.modal.disableOrEnable = true;
            this.selected = this.assign(item);
        },
        async initialize(){
            try{
                let fetch =  await axios.get(this.ipaddress+'/api/category');
                this.data = fetch.data;
                console.log(fetch);
            }catch(e){
                 console.log(e);
            }
            
        },
        async addCat(){
            try{
                let fetch =  await axios.post(this.ipaddress+'/api/addCategory', this.form);
                this.modal.add = false;
                this.data.push(fetch.data);
                console.log(fetch.data);
                this.toast("Successfully added!", "info");
            }catch(e){
                console.log(e);
            }
            
        },
        _open_edit(item) {
            this.modal.edit = true;
            this.selected = this.assign(item);
            },
         _update_Cat(type) {
             if(type == 'status'){
                 this.selected.status = this.selected.status == "1" ? "2" : "1";
             }
            axios.put(this.ipaddress + "/api/editCategory", this.selected)
                .then((response) => {
                Vue.set(this.data, indexOf(
                    this.data,
                    find(this.data, (x) => {
                        return x.id == this.selected.id;
                    })),this.selected
                );
                this.modal.edit = false;
                this.modal.disableOrEnable = false;
                console.log(response.data);
                this.toast("Successfully updated!", "info");
                })
                .catch((error) => {
                console.log("Error in " + error);
                this.modal.edit = false;
                });
            },
        delete_war(item) {
            this.modal.delete = true;
            this.selected = this.assign(item);
        },
        delete_cat() {
            axios.delete(this.ipaddress + "/api/deleteCategory/" + this.selected.id)
                .then((response) => {
                console.log(response);
                this.data.splice(
                    indexOf(
                    this.data,
                    find(this.data, (x) => {
                        return x.id === this.selected.id;
                    })
                    ),
                    1
                );
                this.modal.delete = false;
                this.toast("Successfully deleted!", "error");
                })
                .catch((error) => {
                console.log("Error in " + error);
                });
            },
        }
})
</script>
<style scoped>
.cat{
  height: 100%;
  background: white;
}
</style>
