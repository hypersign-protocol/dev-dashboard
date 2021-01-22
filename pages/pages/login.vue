<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <!-- <qrcode-vue :value="value" :size="400" level="H"></qrcode-vue> -->
                <p><vue-qr :text="value" :logoSrc="logo" :size="190"></vue-qr></p>
                <label style="font-size:larger">Scan the QR code using <a href="https://hypersign.id/" target="_blank"> Hypersign Auth</a> credential in your mobile app to authenticate!</label>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:40%">
              <b-card-body >
                <div>
                  <h2 class="text-center">Hypersign Admin Dashboard</h2>
                  <p> Dashboard for HYPERSIGN developers. You can.</p>
                  <p> Manage Subscription</p>
                  <p> Manage Apps</p>
                  <p> Analytics. etc</p>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
// import QrcodeVue from "qrcode.vue";
import Vue from 'vue'
import url  from 'url';

// Vue.use(QrcodeVue)
export default {
  name: 'Login',
  layout: 'clean',
  components: {
  },
  async created() {
    // console.log('sss',url)
    // console.log('Beofer creating websoceket connection')
    let baseUrl = process.env.studioServer.BASE_URL;
    let websocketUrl = "ws://localhost:4006";
    
    let parsedUrl = {}
    try{
      // debugger
      parsedUrl = url.parse(baseUrl);
      // console.log('parsedUrl',parsedUrl)
      
      websocketUrl = parsedUrl.protocol === 'https:' ?  `wss://${parsedUrl.host}` : `ws://${parsedUrl.host}`;
      // console.log('websocketurl',websocketUrl)
    }catch(e){
      // console.log('baseurl-error',baseUrl)
      // console.log('parsedUrl-error',parsedUrl)
      websocketUrl = "ws://localhost:4006";
    }
  
    this.connection = new WebSocket(websocketUrl);
    this.connection.onopen = function() {
      console.log('Websocket connection is open')
    };
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
            _this.value = messageData.data;
          } else if (messageData.op == 'end') {
            _this.connection.close();
            const authorizationToken = messageData.data.userdata;
            // console.log(authorizationToken)
            localStorage.setItem("authToken",authorizationToken);
            
                if (localStorage.getItem("authToken") != null) {
                      if (_this.$route.params.nextUrl != null) {
                        _this.$router.push(_this.$route.params.nextUrl);
                      } else {
                        _this.$router.push("dashboard");
                      }
                }
              
          }
      };
      this.connection.onerror = function(error) {
        console.log('Websocket connection error ', error);
      };
  },
  data() {
    return {
      value: 'test check',
      logo: 'https://pbs.twimg.com/profile_images/1339121821455589377/pTHnwVap_400x400.jpg'
    }
  }
}
</script>
