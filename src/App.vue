<template>
  <div id="app">
    <v-app>
      <HeaderToolbar :bus='bus' :logon-user='logonUser' />
      <v-content>
        <router-view :bus='bus' :logon-user='logonUser' :user-setting='userSetting' />
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import {loadUserAPI} from '@/apis/server/user'
import {loadPositionAPI} from '@/apis/server/position'
import USER from '@/events/user'
import USERSETTING from '@/events/usersetting'
import HeaderToolbar from '@/components/HeaderToolbar'

/**
 * Event Busの作成
 */
const bus = new Vue()

/**
 * App Component
 * @state {VueInstance} bus Event Bus
 * @state {Object} logonUser ログイン中のユーザー情報
 * @state {Object} userSetting ログイン中ユーザーの設定値
 */
export default {
  name: 'App',
  components: {HeaderToolbar},
  data () {
    return {
      bus: bus,
      logonUser: null,
      userSetting: null
    }
  },
  created () {
    // ログアウトイベントのハンドリング
    this.bus.$on(USER.LOGOUT, () => {
      this.logonUser = null
      this.userSetting = null
      this.$router.replace('/login')
    })
    // ログインイベントのハンドリング
    this.bus.$on(USER.LOGIN, user => {
      this.logonUser = user
      this.$router.replace('/home')
    })
    // ユーザー設定値変更イベントのハンドリング
    this.bus.$on(USERSETTING.CHANGED, setting => {
      this.userSetting = setting
      return true
    })
    // 位置情報APIの初期化
    loadPositionAPI(bus)
    // ユーザーAPIの初期化
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
