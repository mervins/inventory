<template>
  <div class="track">
    <div>
      <v-card class="d-flex mb-6" flat tile>
        <h1 class="ml-5 mr-auto">Track</h1>
        <v-btn
          class="pa-2 ma-2"
          color="primary"
          dark
          @click="dialog.create = true"
        >
          Add Track
        </v-btn>
      </v-card>
    </div>
    <v-row>
      <v-dialog v-model="dialog.create" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">New Track</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Name*"
                    required
                    v-model="form.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Agent*"
                    v-model="form.agent"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Contact Number*"
                    persistent-hint
                    type="number"
                    v-model="form.contact"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Track Number*"
                    persistent-hint
                    type="text"
                    v-model="form.track_number"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog.create = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="add_track"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-dialog v-model="dialog.edit" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Track</span>
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
                  <v-text-field
                    label="Agent*"
                    v-model="selected.agent"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Contact Number*"
                    persistent-hint
                    type="number"
                    v-model="selected.contact"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Track Number*"
                    v-model="selected.track_number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog.edit = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="_update_custome()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog.delete" persistent max-width="390">
        <v-card>
          <v-card-title class="headline">
            Are you sure you want to delete this track?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog.delete = false">
              Disagree
            </v-btn>
            <v-btn color="green darken-1" text @click="delete_track()">
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
            <th class="text-left"><h2>Agent</h2></th>
            <th class="text-left"><h2>Contact Number</h2></th>
            <th class="text-left"><h2>Track Number</h2></th>
            <th class="text-left"><h2>Action</h2></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, key) in track"
            :key="key"
            class="font-weight-regular"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.agent }}</td>
            <td>{{ item.contact }}</td>
            <td>{{ item.track_number }}</td>
            <td>
              <v-btn fab dark small color="cyan" @click="_open_edit(item)">
                <v-icon dark> mdi-pencil </v-icon>
              </v-btn>
              <v-btn  v-if="user.type == 'Administrator'"
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
import axios from "axios";
import indexOf from "lodash/indexOf";
import find from "lodash/find";
import Vue from "vue";
import Helper from "../views/helper/helper.js";
export default {
  mixins: [Helper],
  data: () => ({
    dialog: {
      create: false,
      edit: false,
      delete: false,
    },
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    form: {},
    selected: {},
    track: [],
  }),
  methods: {
    async getdata() {
      let temp_data = await axios.get(this.ipaddress + "/api/track");
      this.track = temp_data.data;
    },
    async add_track() {
      this.dialog.create = false;
      let temp_data = await axios.post(
        this.ipaddress + "/api/addTrack",
        this.form
      );
      console.log(temp_data.data);
      await this.track.push(temp_data.data);
      this.toast("Successfully added!", "info");
    },
    _open_edit(item) {
      this.dialog.edit = true;
      this.selected = this.assign(item);
    },

    assign(data) {
      return JSON.parse(JSON.stringify(data));
    },
    _update_custome() {
      axios
        .put(this.ipaddress + "/api/editTrack", this.selected)
        .then((response) => {
          Vue.set(
            this.track,
            indexOf(
              this.track,
              find(this.track, (x) => {
                return x.id == this.selected.id;
              })
            ),
            this.selected
          );
          this.dialog.edit = false;
          console.log(response.data);
          this.toast("Successfully updated!", "info");
        })
        .catch((error) => {
          console.log("Error in " + error);
          this.dialog.edit = false;
        });
    },
    delete_war(item) {
      this.dialog.delete = true;
      this.selected = this.assign(item);
    },
    delete_track() {
      axios
        .delete(this.ipaddress + "/api/deleteTrack/" + this.selected.id)
        .then((response) => {
          console.log(response);
          this.track.splice(
            indexOf(
              this.track,
              find(this.track, (x) => {
                return x.track_id === this.selected.id;
              })
            ),
            1
          );
          this.dialog.delete = false;
          this.toast("Successfully deleted!", "error");
        })
        .catch((error) => {
          console.log("Error in " + error);
        });
    },
  },
  created() {
    this.getdata();
  },
};
</script>
<style>
.sub_main {
  margin: 3px;
}
.taes {
  font-size-adjust: 50px;
}
.track{
  height: 100%;
  background: white;
}
</style>