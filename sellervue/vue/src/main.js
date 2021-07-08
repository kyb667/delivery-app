import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { store } from './store/store'
import axios from "axios"
import VueCookies from "vue-cookies"

Vue.config.productionTip = false
Vue.use(VueCookies);
Vue.$cookies.config("1d")
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

new Vue({
  router,
  vuetify,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
