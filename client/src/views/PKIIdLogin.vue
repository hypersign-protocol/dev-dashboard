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
.title {
  color: grey;
}

h5 {
   width: 100%; 
   text-align: center; 
   border-bottom: 1px solid #80808045; 
   line-height: 0.1em;
   margin: 10px 0 20px; 
} 

.download{
  padding: 5px;
}
h5 span { 
    background:#fff; 
    padding:0 10px; 
}
</style>
<template>
  <!-- <div class="row" style="margin-left: 35%;"> -->
  <div class="row" style="align-content: center;">
    <!-- <div class="col-md-4"></div> -->
    <div class="col-md-3" style="font-size: small;color:grey;margin-left: 35%;">
      <form action="#">
        <b-card no-body style="padding: 12%; border-top: 4px solid #00f9;">
          <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
        <h4>Login</h4>
         <hr/> 
        
          <div class="row" >
            <form action="#" class="col-md-12">
              <div class="form-group">
                <qrcode-vue :value="value" :size="200" level="H"></qrcode-vue>
                <label style="font-size:larger">Scan the QR code using <a href="#" target="_blank"> Hypersign Auth Credential</a> in your mobile app to login!</label>
                <div>
                  <p>Don’t have the app yet?
                  <div>
                    <span class="download">
                      <a href="https://play.google.com/store/apps/details?id=com.hypersign.cordova" target="_blank"><img src="/images/gplaybadge.png" height="60" width="200"/></a>
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </b-card>
      </form>
    </div>
    <!-- <div class="col-md-4"></div> -->
    
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import url  from 'url';
export default {
  name: "Login",
  components: {
    QrcodeVue,
    Loading,
  },
  data() {
    return {
      active: 0,
      username: "",
      password: "",
      host: location.hostname,
      challenge: "dddd",
      domain: location.host,
      credentials: {},
      userData: {},
      value: '',
      user: {},
      verifiablePresentation: "",
      fullPage: true,
      isLoading: false,
      connection: null,
      privateKey:
        "3isrtEJ4gt1ZHkdUYYph1WFAtzfqAL5WM6Hh1NC2hmWnDfBypXjt5oUFdAqQdiess2vqqQ3iF6x4fDVuvLw454sn",
      did: "did:hs:892325a4-75c9-465c-882b-91e3ca5143c3",
    };
  },
  created() {
    console.log('Beofer creating websoceket connection')

    let websocketUrl = "ws://localhost:4006";
    if(this.$config.studioServer.WEBSOCKET_URL){
      websocketUrl = this.$config.studioServer.WEBSOCKET_URL
    }else{
      websocketUrl = "ws://localhost:4006";
    }
    
    // this.connection = new WebSocket('wss://ssi.hypermine.in/developerws/');
    this.connection = new WebSocket('ws://localhost:5006');
    this.connection.onopen = function() {
      console.log('Websocket connection is open')
    };
         this.isLoading = true;
         var _this = this;
        this.connection.onmessage = function({
            data
        }) {
          console.log('Websocket connection messag receieved ', data);
            let messageData = JSON.parse(data);
            // console.log(messageData)
            if (messageData.op == 'init') {
              _this.isLoading = false;
              // console.log(messageData.data)
              _this.value = JSON.stringify(messageData.data);
            } else if (messageData.op == 'end') {
                _this.connection.close();
                const authorizationToken = messageData.data.token;
                // console.log(authorizationToken)
                localStorage.setItem("authToken",authorizationToken);

                
                    if (localStorage.getItem("authToken") != null) {
                          if (_this.$route.params.nextUrl != null) {
                            _this.$router.push(_this.$route.params.nextUrl);
                          } else {
                            // console.log(_this.$router)
                            _this.$router.push("dashboard");
                          }
                    }
                
            }
        };
        this.connection.onerror = function(error) {
          console.log('Websocket connection error ', error);
        };    
  },
  mounted() {
    this.clean();
  },
  methods: {
    push(path){
      this.$router.push(path)
    },
    clean() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("credentials");
      localStorage.removeItem("userData");
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
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
  },
};
</script>
