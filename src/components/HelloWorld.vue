<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px"  min-width="360px" :retain-focus="false">
      <div>
        <div style="text-align: center; color:white; background:#2C3A47">
          <h1 class="">LOGIN</h1>
        </div>
        <v-card class="px-4">
          <v-card-text>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="loginEmail"
                    label="Username"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="loginPassword" :append-icon="show1 ? 'eye' : 'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                  <v-btn
                    x-large
                    block
                    :disabled="!valid"
                    color="success"
                    @click="validate"
                  >
                    Login
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
  },
  methods: {
    validate() {
      // if (this.$refs.loginForm.validate()) {
      //   // submit form to server/API here...
      // }
      if (this.loginPassword === "admin" && this.loginEmail === "admin") {
        this.dialog = false;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  data: () => ({
    notlogin: false,
    dialog: true,
    tab: 0,
    tabs: [{ name: "Login", icon: "mdi-account" }],
    valid: true,
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    emailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],

    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 2) || "Min 8 characters",
    },
  }),
};
</script>
