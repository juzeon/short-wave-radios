import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios"

let appAxios = axios.create({})
Vue.config.productionTip = false
Vue.prototype.$axios = appAxios

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
