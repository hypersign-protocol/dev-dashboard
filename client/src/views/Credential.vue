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
    <loading :active.sync="isLoading" 
        :can-cancel="true"        
        :is-full-page="fullPage"></loading>

    <div class="row">
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
                      v-model="appName"
                      size="35"
                      placeholder="Enter app name"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 3%">Service Endpoint:</label>
                    <input
                      type="text"
                      v-model="appUrl"
                      size="35"
                      placeholder="Enter service endpoint"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 9%">Description:</label>
                    <textarea
                      v-model="appDescription"
                      rows="5"
                      cols="34"
                      placeholder="Enter description"
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
                      v-model="mailHost"
                      size="35"
                      placeholder="Enter host name"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 17%">Port:</label>
                    <input
                      type="text"
                      v-model="mailPort"
                      size="35"
                      placeholder="Enter mail port"
                      class="form-control"
                    />
                  </div>

                  <div class="form-group form-inline">
                    <label style="margin-right: 17%">User:</label>
                    <input
                      type="text"
                      v-model="mailUser"
                      size="35"
                      placeholder="Enter mail user"
                      class="form-control"
                    />
                  </div>

                  <div class="form-group form-inline">
                    <label style="margin-right: 12%">Password:</label>
                    <input
                      type="password"
                      v-model="mailPassword"
                      size="35"
                      placeholder="Enter mail password"
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
import conf from '../config';
const { hypersignSDK } = conf;
import QrcodeVue from "qrcode.vue";
import Info from '@/components/Info.vue'
export default {
  name: "IssueCredential",
  components: { QrcodeVue, Info },
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
      holderDid: ""
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    //console.log(this.user)
    this.getList('SCHEMA')
    this.getList('CREDENTIAL')
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
    fetchData(url, option) {
      fetch(url)
        .then((res) => res.json())
        .then((j) => {
          if (j.status != 200) throw new Error(j.error);
          return j.message;
        })
        .catch((e) => this.notifyErr(`Error: ${e.message}`));
    },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    addBlankAttrBox() {
      if (this.attributeName != " ") {
        this.attributes.push(this.attributeName);
        this.attributeName = " ";
      }
    },
    onSchemaOptionChange(event) {
      //console.log(event);
      this.attributes = [];
      this.issueCredAttributes = [];
      this.selected = null;
      this.credentialName = "";
    },
    OnSchemaSelectDropDownChange(event) {
      //console.log(event);
      if (event) {
        this.issueCredAttributes = [];
        const id = this.issueCredAttributes.length;
        this.schemaMap[event].forEach((e) => {
          this.issueCredAttributes.push({
            id: id + event,
            type: "text",
            name: e,
            value: "",
          });
        });
      } else {
        this.issueCredAttributes = [];
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
        JSON.stringify(this.signedVerifiableCredential),
        "vc.json"
      );
    },
    generateAttributeMap() {
      let attributesMap = [];
      if (this.issueCredAttributes.length > 0) {
        this.issueCredAttributes.forEach((e) => {
          attributesMap[e.name] = e.value;
        });
      }
      return attributesMap;
    },

    getCredentials(attributesMap) {
      const schemaUrl = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.SCHEMA_GET_EP}/${this.selected}`;
      return hypersignSDK.credential.generateCredential(schemaUrl, {
        subjectDid: this.holderDid,
        issuerDid: this.user.publicKey,
        expirationDate: new Date().toISOString(),
        attributesMap,
      }).then((signedCred) => {
        return signedCred;
      });
    },

    signCredentials(credential) {
      return hypersignSDK.credential.signCredential(credential, this.user.publicKey, this.user.privateKey).then(
        (signedCredential) => {
          return signedCredential;
        }
      );
    },
    async issueCredential() { 
      try{
        this.isLoading = true
        if(this.holderDid == "") throw new Error("Please enter the holder did")
        if(this.selected == null) throw new Error("Please select a schema")

      // generateAttributeMap
      const attributeMap = await this.generateAttributeMap();

      const verifiableCredential = await this.getCredentials(attributeMap);
      // signCredentials
      const signedVerifiableCredential = await this.signCredentials(
        verifiableCredential
      );
      this.signedVerifiableCredential = signedVerifiableCredential;

      const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_ISSUE_EP}`;
      const headers = {
        "Content-Type": "application/json",
        "x-auth-token": this.authToken,
      };
      const body = {
        subject: this.subjectDid,
        schemaId: this.selected,
        dataHash: signedVerifiableCredential,
        appId: "appI123",
      };

      fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((j) => {
          if (j.status != 200) throw new Error(`Error: ${j.error}`);
          if (j.status === 200) {
            this.isCredentialIssued = true;
            this.onSchemaOptionChange(null);
            this.vcList.push({
              ...j.message
            })
            this.isLoading = false
            this.notifySuccess("Credential successfully issued")
          }
        })
        .catch((e) => {
          this.isLoading = false
          this.notifyErr(`Error: ${e.message}`)
        });
      } catch(e){
        this.isLoading = false
        this.notifyErr(`Error: ${e.message}`)
      }
    },
  },
};
</script>


