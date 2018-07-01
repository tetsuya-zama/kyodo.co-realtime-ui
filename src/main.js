// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mdi/css/materialdesignicons.min.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import App from './App'
import router from './router'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in window.navigator) {
    window.addEventListener('load', () => {
      window.navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration)
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
    })
  }
}

/* eslint-disable no-new */
Vue.use(Vuetify)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLEMAP_API_KEY,
    libraries: 'places'
  }
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
