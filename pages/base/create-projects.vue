<template>
  <div class="animated fadeIn">
    <b-row class="form-group">
        <b-col sm="6">
            <label class="col-form-label" for="inputIsValid">Enter App Name</label>
            <b-form-input type="text" placeholder="Enter App Name" v-model="appForm.appName"></b-form-input>
        </b-col>
        <b-col sm="6">
            <label class="col-form-label" for="inputIsValid">Service endpoint url</label>
            <b-form-input type="text" placeholder="Service endpoint url." v-model="appForm.serviceEndPoint"></b-form-input>
        </b-col>
    </b-row>
      
    <b-row class="form-group">
        <b-col sm="6">
            <label class="col-form-label" for="inputIsValid">Any other public info.</label>
            <b-form-textarea
            id="textarea"
            v-model="appForm.otherDetails"
            placeholder="Any other public info (optional)"
            rows="3"
            max-rows="6"
            >
            </b-form-textarea>
        </b-col>
        <b-col sm="6">
            <label class="col-form-label" for="inputIsValid">Logo</label>
            <b-form-group
            label=""
            label-for=""
            :label-cols="0"
            :horizontal="true">
            <b-form-file id="fileInput" :plain="true"></b-form-file>
            </b-form-group>   
        </b-col>      
    </b-row>
    <b-row class="form-group">
        <b-col sm="6">
            <b-button class="mt-3" block @click="createApp">Save</b-button>
        </b-col>    
    </b-row>
  </div>
</template>
<style scoped>
.user-avatar {
  text-align: center;
}
img {
  overflow: inherit;
}

.selected{
  background-image:linear-gradient(to right top,#3a7a96,#4386a3,#509ab9);
  -webkit-transition: .5s;
  transition: .5s;
  background-size: 350% auto;
  cursor: pointer;
}
.selected:hover {
    background-position: 100% 0;
}
.card-header:first-child {
    border-radius: .75rem;
}

.text-white {
    color: #d0d0d0!important;
}

.lead {
    font-size: 1.8rem;
    font-weight: 300;
    line-height: 2rem;
}
</style>
<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

export default {
  name: 'cards',
  data () {
      return {
        infoModal: false,
        appForm:{
          appId:'',
          appName:'',
          serviceEndPoint:'http://localhost:8080/',
          logo:'',
          otherDetails:''
        },

      }
  },
  computed : {
    
  },
  methods: {
    avatar() {
      const avatars = new Avatars(sprites, {height:100});
      return {
        type: 'avatar',
        src: avatars.create(makeid(6)),
      }
    },
    createApp() {
      let appData = this.appForm
      appData.appId = 'did:hs:'+makeid(15)
      this.projects.push(appData)
      this.infoModal= false
      this.clearform()
    },
    clearform() {
      this.appForm = {
          appId:'',
          appName:'',
          serviceEndPoint:'http://localhost:8080/',
          logo:'',
          otherDetails:''
        }
    }
  }
}
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
</script>
