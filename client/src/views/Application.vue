<style scoped>
.btn:focus,
.btn.focus {
  box-shadow: none !important;
}
.toggle {
  margin: 1em;
}
.slidein {
  min-width: 600px;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background: white;
  height: 100%;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
  font-size: large;
}

/* before the element is shown, start off the screen to the right */
.slide-enter,
.slide-leave-active {
  right: -100%;
}

.close-btn {
  border: none;
  font-weight: bold;
  font-size: 2em;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5em;
}
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
  float: right;
}

.card-header {
  background: aliceblue;
  padding: 0px;
}

.card {
  border-radius: 10px;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: rgb(147, 147, 158);
}
.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgb(211, 206, 206);
}
.separator::before {
  margin-right: 0.25em;
}
.separator::after {
  margin-left: 0.25em;
}

.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 100%;
  border-radius: 5px;
  padding: 0px;
}

.card:hover {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

img {
  border-radius: 5px 5px 0 0;
}

.container {
  padding: 2px 16px;
}
</style>
<template>
  <div class="home marginLeft marginRight">
    <div class="row">
      <div class="col-md-12" style="text-align: left; min-height: 100%">
        <loading
          :active.sync="isLoading"
          :can-cancel="true"
          :is-full-page="fullPage"
        ></loading>
        <div>
          <button
            class="btn btn-outline-primary btn-sm"
            style="float: right"
            @click="toggle"
          >
            <i class="fas fa-plus"></i> Create App
          </button>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div class="slidein" v-if="open">
        <div class="card" style="text-align: left; min-height: 100%">
          <div class="card-header" style="padding: 2%">
            <!-- <b-button variant="link" style="float: left" @click="toggle"
              >x</b-button
            > -->
            <a href="#" @click="toggle" style="float: left"><i class="fas fa-times"></i></a>
            <label style="margin-left: 2%">Application Configurations</label>
          </div>
          <div class="card-body">
            <Errors v-if="errors.length > 0" :errors="errors" />
            <div class="">
              <div class="row form-group">
                <div class="col-md-4">
                  <label>App Name:</label>
                </div>
                <div class="col-md-8">
                  <input
                    type="text"
                    v-model="basic.name"
                    size="35"
                    placeholder="Enter app name"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row form-group">
                <div class="col-md-4">
                  <label>Service Endpoint:</label>
                </div>
                <div class="col-md-8">
                  <input
                    type="text"
                    v-model="basic.serviceEndpoint"
                    size="35"
                    placeholder="Enter service endpoint"
                    class="form-control"
                  />
                </div>
              </div>
              <!-- <div class="row form-group">
                <div class="col-md-4">
                  <label>Logo url:</label>
                </div>
                <div class="col-md-8">
                  <input
                    type="text"
                    v-model="basic.logoUrl"
                    size="35"
                    placeholder="Enter logo url"
                    class="form-control"
                  />
                </div>
              </div> -->
              <div class="row form-group">
                <div
                  class="col-md-12"
                  style="
                    border-radius: inherit;
                    text-align: left;
                    border-style: hidden;
                  "
                >
                  <div class="">
                    <b-button
                      style="padding-left: 0px"
                      v-b-toggle.collapse-2
                      variant="link"
                      >Advance Configurations (optional)</b-button
                    >
                  </div>
                  <b-collapse id="collapse-2">
                    <div class="card-body">
                      <div class="row form-group">
                        <div class="col-md-4">
                          <label style="">Schema:</label>
                        </div>
                        <div class="col-md-8">
                          <b-form-select
                            v-model="selected"
                            :options="selectOptions"
                            size="md"
                            class="mt-3"
                            style="margin-top: 0rem !important"
                          ></b-form-select>
                        </div>
                      </div>
                      <div class="separator form-group">
                        E-mail configuration
                      </div>
                      <div class="row form-group">
                        <div class="col-md-4">
                          <label>Host:</label>
                        </div>
                        <div class="col-md-8">
                          <input
                            type="text"
                            v-model="advance.mail.host"
                            size="35"
                            placeholder="Enter host name"
                            class="form-control"
                          />
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-md-4">
                          <label>Port:</label>
                        </div>
                        <div class="col-md-8">
                          <input
                            type="text"
                            v-model="advance.mail.port"
                            size="35"
                            placeholder="Enter mail port"
                            class="form-control"
                          />
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-md-4">
                          <label>User:</label>
                        </div>
                        <div class="col-md-8">
                          <input
                            type="text"
                            v-model="advance.mail.user"
                            size="35"
                            placeholder="Enter mail user"
                            class="form-control"
                          />
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-md-4">
                          <label>Password:</label>
                        </div>
                        <div class="col-md-8">
                          <input
                            type="password"
                            v-model="advance.mail.pass"
                            size="35"
                            placeholder="Enter mail password"
                            class="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </b-collapse>
                </div>
              </div>

              <div class="row form-group">
                <div class="col-md-12">
                  <button
                    class="btn btn-outline-primary btn-sm"
                    @click="createApp()"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="row" style="margin-top: 1%">
      <div class="col-md-12">
        <div class="row">
          <!-- <div
            class="card col-md-3"
            style="margin-top: 1%; margin-left: 2%; margin-right: 2%"
          >
            <div class="card-body" style="min-height: 400px">
              <p>
                <button
                  class="btn btn-outline-primary btn-sm largebutton"
                  style="border: none; margin-top: 7%"
                  @click="toggle"
                >
                  <img src="/images/plus-large.png" style="width: 100%" />
                </button>
              </p>
              <h5 style="color: gray"><b>Create App</b></h5>
            </div>
          </div> -->
          <div
            v-for="app in appList"
            :key="app.did"
            class="card col-md-5"
            style="margin-right:2%; margin-bottom:2%"
          >
          <div class="card-header" style="padding: 2%;">
            <b>{{ app.name }}</b>
          </div>
            <div class="card-body">
              <!-- <div class="row">
                <div class="col-md-12">
                  <b>{{ app.name }}</b>
                  <hr />
                </div>
              </div> -->
              <div class="row" style="min-height: 163px">
                <div class="col-md-4">
                   <img
                      src="/images/robot.png"
                      style="width: 150px; height: 150px"
                    />
                </div>

                <div
                  class="col-md-8"
                  style="text-align: left; font-size: small; color: gray"
                >
                  <ul style="list-style-type: none; padding: 0; margin: 0">
                    <li>
                      <label>APP DID</label>
                    </li>
                    <li>
                      <label
                        ><a
                          v-bind:href="
                            `${$config.nodeServer.BASE_URL}api/v1/did/` +
                            app.did
                          "
                          target="_blank"
                          >{{ app.did }}</a
                        ></label
                      >
                    </li>
                    <li v-if="app.schemaId">
                      <label>SCHEMA</label>
                    </li>
                    <li v-if="app.schemaId">
                      <label
                        ><a
                          v-bind:href="
                            `${$config.nodeServer.BASE_URL}api/v1/schema/` +
                            app.schemaId
                          "
                          target="_blank"
                          >{{ app.schemaId }}</a
                        ></label
                      >
                    </li>
                    <li v-if="app.serviceEp">
                      <label>SERVICE ENDPOINT</label>
                    </li>
                    <li v-if="app.serviceEp">
                      <label
                        ><a href="#">{{ app.serviceEp }}</a></label
                      >
                    </li>
                  </ul>

                  <!-- <p style="font-size: small; color: gray">
                  <a
                    v-bind:href="
                      'https://ssi.hypermine.in/core/api/did/resolve/' + app.did
                    "
                    target="_blank"
                    >{{ app.did }}</a
                  >
                </p>
                <p v-if="app.schemaId">
                  <label>Schema:</label>
                  <a
                    v-bind:href="
                      'https://ssi.hypermine.in/core/api/schema/get/' +
                      app.schemaId
                    "
                    target="_blank"
                    >{{ app.schemaId }}</a
                  >
                </p>
                <p v-if="app.serviceEp">
                  Service Ep: <a href="#">{{ app.serviceEp }}</a>
                </p> -->
                </div>

                
              </div>
              <div class="row" >
                <div class="col-md-2"></div>
                <div class="col-md-10" style="text-align: right;color: gray;">
                  <i title="Feature coming soon..." class="fas fa-edit"></i> | <i title="Feature coming soon..." class="fas fa-download"></i> | <i title="Feature coming soon..." class="fas fa-trash"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import Info from "@/components/Info.vue";
import Errors from "@/components/Errors.vue";
import Loading from "vue-loading-overlay";
import { specialCharCheck } from "../utils/utility";
import { isWebUri } from "valid-url";
export default {
  name: "CreateApplication",
  components: { Info, Loading, Errors },
  data() {
    return {
      description:
        'An issuer can issue a credential to a subject (or holder) which can be verfied by the verifier independently, without having him to connect with the issuer. They are a part of our daily lives; driver\'s licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries.  For example: an airline company can issue a flight ticket ("verfiable credential") using schema (issued by DGCA) to the passenger.',
      open: false,
      host: location.hostname,
      user: {},
      prevRoute: null,
      credentialName: "",
      selected: null,
      authToken: localStorage.getItem("authToken"),
      selectOptions: [{ value: null, text: "Select a schema" }],
      schemaMap: {},
      appList: [],
      schemaList: [],
      fullPage: true,
      isLoading: false,
      errors: [],
      basic: {
        name: "",
        serviceEndpoint: "",
      },
      advance: {
        schemaId: "",
        mail: {
          host: "",
          port: 0,
          user: "",
          pass: "",
        },
      },
      hypersignJson: {},
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.getList("SCHEMA");
    this.getList("CREDENTIAL");
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
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
    toggle() {
      this.open = !this.open;
    },
    formatSchemaString(schemaStr){
      const sJson =  schemaStr;
        if(sJson){
          const schemaObj =  JSON.parse(sJson);
          const schema = {
            id: "",
            credentialName: "",
            version: "",
            attributes: [],
            description: ""
          }

          schema.id = schemaObj.id;
          schema.credentialName = schemaObj.name;
          schema.version = schemaObj.modelVersion;
          schema.attributes = schemaObj.schema.required;
          schema.description = schemaObj.schema.description;
          return schema;
      }else{
        return null
      }
    },
    async getList(type) {
      let url = "";
      let options = {};
      if (type === "SCHEMA") {
        url = `${this.$config.studioServer.BASE_URL}hs/api/v2/schema/get`;
        options = {
          method: "GET",
          headers: { Authorization: `Bearer ${this.authToken}` },
        };
      } else {
        url = `${this.$config.studioServer.BASE_URL}hs/api/v2/app`;
        options = {
          method: "GET",
          headers: { Authorization: `Bearer ${this.authToken}` },
        };
      }

      const resp = await fetch(url, options);
      const j = await resp.json();
      if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      if (type === "SCHEMA") {
        const schemaList = j.message;
        if (schemaList && schemaList.length > 0) {
          schemaList.forEach((element) => {
            const s  = this.formatSchemaString(element.schemaString)
            if(s){
              this.schemaMap[s.id] = s.attributes;
              this.selectOptions.push({
                value: s.id,
                text: `${s.credentialName} | ${s.id}`,
              });
            }            
          });
        }
      } else {
        this.appList = j.message;
      }
    },
    forceFileDownload(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    downloadCredentials() {
      this.forceFileDownload(
        JSON.stringify(this.hypersignJson),
        "hypersign.json"
      );
    },
    fieldValidations() {
      this.errors = [];
      if (this.basic.name == "") this.errors.push("AppName can not be empty");
      if (this.basic.serviceEndpoint == "")
        this.errors.push("Service Endpoint Url can not be empty");

      if (this.basic.name != "" && specialCharCheck(this.basic.name))
        this.errors.push("AppName can not contain special character");

      if (
        this.basic.serviceEndpoint != "" &&
        !isWebUri(this.basic.serviceEndpoint)
      ) {
        this.errors.push("Invalid service endpoint url");
      }

      // if (this.basic.logoUrl != "" && !isWebUri(this.basic.logoUrl))
      //   this.errors.push("Invalid logo url");

      if (this.errors.length > 0) return false;
      else return true;
    },

    async createApp() {
      //TODO: validate fields
      if (!this.fieldValidations()) {
        setTimeout(() => {
          this.errors = [];
        }, 5000);
        return;
      }

      this.isLoading = true;
      setTimeout(async () => {
        try {
          const createAppUrl = `${this.$config.studioServer.BASE_URL}hs/api/v2/app/create`;
          const data = {
            basic: {},
            advance: {},
          };


          Object.assign(data.basic, this.basic);

          data.advance.schemaId = this.selected ? this.selected : "";
          const resp = await fetch(createAppUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.authToken}`,
            },
          });
          const json = await resp.json();
          if (json.status === 200) {
            Object.assign(this.hypersignJson, json.message.hypersignJSON);
            Object.assign(this.hypersignJson.mail, this.advance.mail);
            this.hypersignJson.mail.name = this.basic.name;
            this.downloadCredentials();
            this.appList.push(json.message.newApp);

            this.notifySuccess("App is created");
            this.isLoading = false;
            // TODO clear all fields.
          } else {
            this.isLoading = false;
            throw new Error(`Error: ${json.error}`);
          }
        } catch (e) {
          this.isLoading = false;
          this.notifyErr(`Error: ${e.message}`);
        }
        this.cleanFields();
      }, 2000);
    },
    cleanFields() {
      Object.assign(this.basic, {
        name: "",
        description: "",
        serviceEndpoint: "",
        did: "",
        logoUrl: "",
      });
      Object.assign(this.advance, {
        schemaId: "",
        mail: {
          host: "",
          port: 0,
          user: "",
          pass: "",
        },
      });
      this.toggle();
      this.selected = null;
    },
  },
};
</script>


