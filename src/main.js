// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mdi/css/materialdesignicons.min.css'
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

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
