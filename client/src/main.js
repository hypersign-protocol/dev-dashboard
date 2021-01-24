import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import config from './config';
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(Notifications);
Vue.use(Donut);

Vue.prototype.$config = config

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')