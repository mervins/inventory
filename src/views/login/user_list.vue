<template>
  <div>
    <div>
      <v-card class="d-flex mb-6" flat tile>
        <h1 class="ml-5 mr-auto">USERS</h1>
         <v-btn  class="pa-2 ma-2 "  color="primary" dark route to="/register">
          Add User
      </v-btn>
      </v-card>
    </div> 
     <v-row>
      <v-dialog v-model="dialog.edit" persistent max-width="400px"> 
        <v-card>
          <v-card-title>
            <span class="headline">Edit User</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Name*"
                    required
                    v-model="selected.name" 
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field label="Username*" 
                    v-model="selected.username"></v-text-field>
                </v-col>
                <!-- <v-col cols="12" md="12">
                  <v-text-field
                    label="Contact Number*"
                    persistent-hint
                    type="number" 
                    v-model="selected.contact"
                    required
                  ></v-text-field>
                </v-col> -->
                 <v-select
                    :items="['User', 'Administrator']"
                    label="Type*"
                    v-model="selected.type"
                    required
                  ></v-select>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog.edit = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="_update_user">
              Save
            </v-btn>
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
            Are you sure you want to delete this user?
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
              @click="delete_user"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <br />
    <hr /> 
    
    <v-simple-table fixed-header height="500px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"><h2>Name</h2></th>
            <th class="text-left"><h2>Username</h2></th>
            <th class="text-left"><h2>Type</h2></th>
            <th class="text-left"><h2>Action</h2></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, key) in users"
            :key="key"
            class="font-weight-regular"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.type }}</td>
            <td>
              <v-btn fab dark small color="cyan" @click=_open_edit(item)>
                <v-icon dark> mdi-pencil </v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="red"
                @click="delete_war(item)"
              >
                <v-icon dark> mdi-delete </v-icon>
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
import Helper from "../helper/helper.js";
import indexOf from "lodash/indexOf";
import find from "lodash/find";
import Vue from 'vue';
export default {
    mixins:[Helper],
    data:()=>({
        users:[],
        dialog:{
        create: false,
        edit:false,
        delete:false
        },
        selected:{}
    }),
    created(){
        this.getdata();
    },
    methods:{
        async getdata(){ 
        let temp_data =  await axios.get(this.ipaddress+'/api/alluser');
        this.users = temp_data.data; 
      },
      _open_edit(item){
           this.dialog.edit = true;
            this.selected = this.assign(item)
      },
      delete_war(item){
        this.dialog.delete = true;
        this.selected = this.assign(item)
      },
       _update_user(){ 
      axios.put(this.ipaddress+"/api/edituser", this.selected).then((response) => {
          Vue.set(
            this.users,
            indexOf(
              this.users,
              find(this.users, (x) => { 
                return x.id == this.selected.id;
              })
            ),
            this.selected
          );
           this.dialog.edit = false;  
           console.log(response.data)
           this.toast('Successfully updated!','info'); 
        })
        .catch((error) => {
          console.log("Error in " + error); 
           this.dialog.edit = false;  
        });
    },
    delete_user(){ 
      axios.delete("http://127.0.0.1:3308/api/deleteuser/" + this.selected.id).then((response) => {
          console.log(response); 
          this.users.splice(indexOf(this.users,
              find(this.users, (x) => {
                return x.id === this.selected.id;
              })
            ),
            1
          ); 
          this.dialog.delete = false; 
          this.toast('Successfully deleted!','error'); 
        })
        .catch((error) => {
          console.log("Error in " + error); 
        });
    },
    }
};
</script>