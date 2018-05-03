<template>
  <div id="app">
    <router-view :bus='bus' :logon-user='logonUser' :user-setting='userSetting' />
  </div>
</template>

<script>
import Vue from 'vue'
import {loadUserAPI} from '@/apis/server/user'
import USER from '@/events/user'
import USERSETTING from '@/events/usersetting'

const bus = new Vue()

export default {
  name: 'App',
  data () {
    return {
      bus: bus,
      logonUser: null,
      userSetting: null
    }
  },
  created () {
    this.bus.$on(USER.LOGOUT, () => this.$router.replace('/login'))
    this.bus.$on(USER.LOGIN, user => {
      this.logonUser = user
      this.$router.replace('/home')
    })
    this.bus.$on(USERSETTING.CHANGED, setting => {
      this.userSetting = setting
      return true
    })
    loadUserAPI(bus)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
