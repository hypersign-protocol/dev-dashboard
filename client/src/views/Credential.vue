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
  float: right;
}

.card-header {
  background: aliceblue;
  padding: 0px;
}

.card{
  border-radius: 10px;
}


.separator {
    display: flex;
    align-items: center;
    text-align: center;
    color: rgb(147, 147, 158);
}
.separator::before, .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgb(211, 206, 206);
}
.separator::before {
    margin-right: .25em;
}
.separator::after {
    margin-left: .25em;
}

</style>
<template>
  <div class="home marginLeft marginRight">
    <div class="row">
      <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
      <div class="col-md-12" style="text-align: left">
        <Info :message="description"/>
        <div class="card">
          <div class="card-header">
            <b-button v-b-toggle.collapse-1 variant="link">Create an app</b-button>
          </div>
          <b-collapse id="collapse-1" class="mt-2">
            <div class="card-body">
              
              <div class="row">
                <div class="col-md-6">
                    <div class="separator">BASIC CONFIGURATION</div>
                </div>
                <div class="col-md-6">
                    <div class="separator">ADVANCE CONFIGURATION (OPTIONAL)</div>
                </div>
                <div class="col-md-6">
                  <div class="form-group form-inline">
                    <label style="margin-right: 10%">App Name:</label>
                    <input
                      type="text"
                      v-model="basic.name"
                      size="35"
                      placeholder="Demo Application"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 3%">Service Endpoint:</label>
                    <input
                      type="text"
                      v-model="basic.serviceEndpoint"
                      size="35"
                      placeholder="https://demoapp.com"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 9%">Description:</label>
                    <textarea
                      v-model="basic.description"
                      rows="5"
                      cols="34"
                      placeholder="Description of this application"
                      class="form-control"
                    ></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group form-inline">
                    <label style="margin-right: 12%">Schema:</label>
                    <b-form-select
                        v-model="selected"
                        :options="selectOptions"
                        size="md"
                        class="mt-3"
                      ></b-form-select>
                  </div>
                  <div class="separator">E-mail configuration</div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 17%">Host:</label>
                    <input
                      type="text"
                      v-model="advance.mail.host"
                      size="35"
                      placeholder="smtp.gmail.com"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 17%">Port:</label>
                    <input
                      type="number"
                      v-model="advance.mail.port"
                      size="35"
                      placeholder="465"
                      class="form-control"
                    />
                  </div>

                  <div class="form-group form-inline">
                    <label style="margin-right: 17%">User:</label>
                    <input
                      type="text"
                      v-model="advance.mail.user"
                      size="35"
                      placeholder="Enter mail user"
                      class="form-control"
                    />
                  </div>

                  <div class="form-group form-inline">
                    <label style="margin-right: 12%">Password:</label>
                    <input
                      type="password"
                      v-model="advance.mail.pass"
                      size="35"
                      placeholder="*****"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-md-12">
                  <hr />
                  <button class="btn btn-outline-primary btn-sm" @click="createApp()">Create</button>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 2%;">
      <div class="col-md-12">
        <table class="table table-bordered" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>id</th>
              <th>schemaId</th>
              <th>issuer</th>
              <th>subject</th>
              <th>dataHash</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in vcList" :key="row">
              <th scope="row">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" :id="row.id" />
                  <label class="custom-control-label" :for="row.id">{{row.id}}</label>
                </div>
              </th>
              <td>{{row.schemaId}}</td>
              <td>{{row.issuer}}</td>
              <td>{{row.subject}}</td>
              <td>{{row.dataHash}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import Info from '@/components/Info.vue';
import Loading from "vue-loading-overlay";
export default {
  name: "IssueCredential",
  components: { Info, Loading },
  data() {
    return {
      description: "An issuer can issue a credential to a subject (or holder) which can be verfied by the verifier independently, without having him to connect with the issuer. They are a part of our daily lives; driver's licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries.  For example: an airline company can issue a flight ticket (\"verfiable credential\") using schema (issued by DGCA) to the passenger.",
      active: 0,
      host: location.hostname,
      user: {},
      prevRoute: null,
      attributeName: "",
      attributes: [],
      issueCredAttributes: [],
      radioSelected: "create",
      credentialName: "",
      isCredentialIssued: false,
      signedVerifiableCredential: "",
      credentials: JSON.parse(localStorage.getItem("credentials")),
      subjectDid: "did:hs:AmitKumar",
      radioOptions: [
        { text: "Create new schema", value: "create" },
        { text: "Select existing schema", value: "existing" },
      ],
      selected: null,
      attributeValues: {},
      authToken: localStorage.getItem("authToken"),
      selectOptions: [{ value: null, text: "Select a schema" }],
      schemaMap: {},
      vcList : [],
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "",
      basic: {
        name: "",
        description: "",
        serviceEndpoint: "",
        did:""
      },
      advance: {
        schemaId: "",
        mail: {
            host: "",
            port: 0,
            user: "",
            pass: ""
        },
      },
      hypersignJson: {}
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.getList('SCHEMA')
    // this.getList('CREDENTIAL')
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    notifySuccess(msg){
      this.$notify({
          group: 'foo',
          title: 'Information',
          type: 'success',
          text: msg
        });
    },
    notifyErr(msg){
      this.$notify({
          group: 'foo',
          title: 'Error',
          type: 'error',
          text: msg
        });
    },
    async getList(type) {
      let url = "";
      let options = {}
      if(type === "SCHEMA"){
        url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.SCHEMA_LIST_EP}`;
        options  = {
          method: "GET"
        }
      }else{
        url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}`;
        options  = {
          method: "GET",
          headers: {'x-auth-token': this.authToken}
        }
      }
      
      const resp = await fetch(url, options);
      const j = await resp.json();
      if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      if(type === "SCHEMA"){
        const schemaList = j.message
        if(schemaList && schemaList.length > 0){
          schemaList.forEach(s => {
            if(s.owner != this.user.id) return
            this.schemaMap[s.id] = JSON.parse(s.attributes)
            this.selectOptions.push({
              value: s.id,
              text: `${s.credentialName} | ${s.id}`
            })
          });
        }
      }else{
        this.vcList = j.message.list;
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
   async createApp(){
      try{
        this.isLoading = true;
        setTimeout(async () => {

        
        const createAppUrl = `${this.$config.studioServer.BASE_URL}hs/api/v2/app/create`;
        const data = {
          basic : {},
          advance: {}
        };

        Object.assign(data.basic, this.basic);
        data.advance.schemaId = this.selected? this.selected: "";
        const resp = await fetch(createAppUrl, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" }
        });
        const json =  await resp.json();
        if (json.status === 200) {
          console.log(json.message)
          Object.assign(this.hypersignJson,json.message)
          Object.assign(this.hypersignJson.mail, this.advance.mail)          
          console.log(this.hypersignJson);
          this.hypersignJson.mail.name = this.hypersignJson.app.appName;
          
          
          this.downloadCredentials();
          this.isLoading = false;
          this.notifySuccess("App is created");
          
        }else{
          throw new Error(`Error: ${json.error}`);
        }
        }, 2000)
      }catch(e){
        this.isLoading = false;
        this.notifyErr(`Error: ${e.message}`);
      }
    }
  },
};
</script>


