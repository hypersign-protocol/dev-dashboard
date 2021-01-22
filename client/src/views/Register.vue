<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}
.floatLeft {
  float: left;
}
.floatRight {
  text-align: end;
}
</style>
<template>
  <div class="home">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
  <div class="col-md-3" style="font-size: small;color:grey;margin-left: 36%;">
      <form action="#" style="padding:6px">
        <b-card no-body style="padding: 40px">
          <h4>Sign Up</h4>
          <hr/>
          <div class="row">
            <form action="#" class="col-md-12">
              <div class="form-group">
                <label class="floatLeft">Name:</label>
                <input type="text" class="form-control" v-model="fullName" placeholder="Enter name"/>
              </div>
              <div class="form-group">
                <label class="floatLeft">Email:</label>
                <input type="email" class="form-control" v-model="email" placeholder="Enter email" />
              </div>
              <div class="form-group">
                <label class="floatLeft">Hypersign DID (<a :href="`${$config.explorer.BASE_URL}`" target="_blank">Get a DID</a>):</label>
                <input type="text" class="form-control" v-model="did" placeholder="Enter DID (did:hs:...)"/>
              </div>
            </form>
          </div>
          <div class="row">
            <div class="col-sm-3" hidden>
              <button
                type="button"
                data-toggle="modal"
                @click="downloadPresentation()"
                class="btn btn-primary btn-sm floatLeft"
              >View Proof</button>
            </div>
            <div class="col-sm-3">
              <button
                type="button"
                data-toggle="modal"
                @click="signup()"
                class="btn btn-primary"
              >Signup</button>
            </div>
            <div class="col-md-9 floatRight">
              Back to
              <a @click="push('login')" style="color:blue; cursor: pointer;">Login</a>
            </div>
          </div>
        </b-card>
      </form>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
const { sha256hashStr } = require("../utils/hash");
import Loading from "vue-loading-overlay";
export default {
  name: "Register",
  components: {},
  components: {
    Loading,
  },
  data() {
    return {
      active: 0,
      fullName: "",
      email: "",
      phno: "",
      publicKey: "",
      username: "",
      password: "",
      host: location.hostname,
      keys: {},
      did: "",
      isLoading:  false,
      fullPage: true
    };
  },
  created() {},
  methods: {
    push(path){
      this.$router.push(path)
    },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },

    notifySuccess(msg) {
      this.$notify({
        group: "foo",
        title: "Information",
        type: "success",
        text: msg,
      });
    },
    notifyErr(msg) {
      this.$notify({
        group: "foo",
        title: "Error",
        type: "error",
        text: msg,
      });
    },
    async signup() {
      this.isLoading = true
      try {
        if(this.email == "" || this.name == "" || this.did == "") throw new Error("All fields are mandatory")
        //console.log('Inside signup')
        const userData = {
          fname: this.fullName,
          email: this.email,
          publicKey: this.did,
        };
        const url = `${this.$config.studioServer.BASE_URL}api/auth/register`;
        const resp = await fetch(url, {
          body: JSON.stringify(userData),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const j = await resp.json();
        //console.log(j)
        if (j.status == 500) {
          this.isLoading = false
          throw new Error(j.error);
        }
        this.isLoading = false
        alert("An email has been sent to you. Please click on the link to verify and download HypersignAuth credentials."); 
        this.isLoading = false
        this.$router.push("login");
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message);
      }
    },
  },
};
</script>


