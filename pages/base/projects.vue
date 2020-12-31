<template>
  <div class="animated fadeIn">
    <b-row style="margin-bottom:10px" >
      <b-col sm="12"> 
        <b-button 
        variant="outline-primary rounded float-right" 
        @click="infoModal = true"
        >
          <i class="fa fa-plus"></i>&nbsp;Create App
        </b-button>
      </b-col>
     
    </b-row>
    <b-row>
      <b-col sm="3"  v-for="(item,i) in projects" :key=i>
        <b-card
        >
          <blockquote class="card-blockquote " >
            <span class="float-right rounded" @click="removeApp(item.appId)">
              <i class="fa fa-trash-o" >

              </i>
            </span>
            <p class="text-white"><a href="#">{{item.appId}}</a></p>
            <div v-html="avatar().src" class="user-avatar"/>
            <p class="lead text-white">{{item.appName}}</p>
            <footer>
              <cite title="Source Title">{{item.serviceEndPoint}}</cite>
            </footer>
          </blockquote>
        </b-card>
      </b-col>
      <b-col sm="12" v-if="projects.length <1">
        <b-card>
          Click on Create App to get your API keys
        </b-card>
      </b-col>
    </b-row><!--/.row-->
    <b-modal title="Create App" 
      size="xl" 
      class="modal-primary" 
      v-model="infoModal" 
      hide-footer
      no-fade
    >
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
    </b-modal>
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
import {mapState, mapMutations} from 'vuex'
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
        }
      }
  },
  computed : {
    ...mapState({
        projects: state => state.projects
    })
  },
  methods: {
    avatar() {
      const avatars = new Avatars(sprites, {height:100});
      return {
        type: 'avatar',
        src: avatars.create(makeid(6)),
      }
    },
    ...mapMutations({
      addProject: "addProject",
      removeProject: "removeProject"
    }),
    createApp() {
      let appData = this.appForm
      appData.appId = 'did:hs:'+makeid(15)
      this.addProject(appData)
      this.infoModal= false
      this.clearform()
    },
    removeApp(data) {
      this.removeProject(data)
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
