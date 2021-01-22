import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import config from './config'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(Notifications)

Vue.prototype.$config = config

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
