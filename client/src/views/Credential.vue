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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 100%;
  border-radius: 5px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
/* .largebutton:hover {

} */

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
        <Info :message="description" />
        <!-- <div>
          <button
            class="btn btn-outline-primary btn-sm"
            style="float: right"
            @click="toggle"
          >
            + Create App
          </button>
        </div> -->
      </div>
    </div>
    <transition name="slide">
      <div class="slidein" v-if="open">
        <div class="card" style="text-align: left; min-height: 100%">
          <div class="card-header">
            <b-button variant="link" style="float: left" @click="toggle"
              >x</b-button
            >
            <b-button v-b-toggle.collapse-1 variant="link"
              >Application Configurations</b-button
            >
          </div>
          <div class="card-body">
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
              <div class="row form-group">
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
              </div>
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
                      >ADVANCE CONFIGURATION (OPTIONAL)</b-button
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

    <div class="row">
      <div class="col-md-12" style="margin: 5%">
        <div class="row">
          <div class="card col-md-3" style="margin: 2%">
            <div class="card-body" style="min-height: 400px">
              <p>
                <button
                  class="btn btn-outline-primary btn-sm largebutton"
                  style="border: none; margin-top: 7%"
                  @click="toggle"
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM1zuIzhqqgnFPMdrXCxhCy0WXhr_YunLdAw&usqp=CAU"
                    style="width: 100%"
                  />
                </button>
              </p>
              <hr/>
              <h5 style="color: gray"><b>Create App</b></h5>
            </div>
          </div>
          <div
            v-for="app in appList"
            :key="app.did"
            class="card col-md-3"
            style="margin: 2%"
          >
            <div class="card-body" style="min-height: 400px">
              <h4>
                <b>{{ app.name }}</b>
              </h4>
              <hr />
              <p>
                <img
                  src="https://img.icons8.com/bubbles/2x/robot.png"
                  style="size: 100%"
                />
              </p>

              <div style="text-align: left">
                <p style="font-size: small; color: gray">
                  <a
                    v-bind:href="
                      'https://ssi.hypermine.in/core/api/did/resolve/' + app.did
                    "
                    target="_blank"
                    >{{ app.did }}</a
                  >
                </p>
                <p v-if="app.schemaId">
                  Schema:
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
                  Service Endpoint: <a href="#">{{ app.serviceEp }}</a>
                </p>
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
import Loading from "vue-loading-overlay";
export default {
  name: "CreateApplication",
  components: { Info, Loading },
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
      basic: {
        name: "",
        description: "",
        serviceEndpoint: "",
        did: "",
        logoUrl: "",
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
    toggle() {
      this.open = !this.open;
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
    async getList(type) {
      let url = "";
      let options = {};
      if (type === "SCHEMA") {
        url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.SCHEMA_LIST_EP}`;
        options = {
          method: "GET",
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
          schemaList.forEach((s) => {
            if (s.owner != this.user.id) return;
            this.schemaMap[s.id] = JSON.parse(s.attributes);
            this.selectOptions.push({
              value: s.id,
              text: `${s.credentialName} | ${s.id}`,
            });
          });
        }
      } else {
        this.appList = j.message;
        console.log(this.appList);
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
    async createApp() {
      try {
        this.isLoading = true;
        setTimeout(async () => {
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
            console.log(json.message);
            Object.assign(this.hypersignJson, json.message.hypersignJSON);
            Object.assign(this.hypersignJson.mail, this.advance.mail);
            console.log(this.hypersignJson);
            this.hypersignJson.mail.name = this.hypersignJson.app.appName;
            this.downloadCredentials();
            this.appList.push(json.message.newApp);

            this.notifySuccess("App is created");
            this.isLoading = false;

            // TODO clear all fields.
          } else {
            this.isLoading = false;
            throw new Error(`Error: ${json.error}`);
          }
        }, 2000);
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(`Error: ${e.message}`);
      }
    },
  },
};
</script>


