<template>
  <div>
    <MyLocation :bus='bus' :user-location='userLocation' :user-setting='userSetting' />
    <MemberLocations :bus='bus' :logon-user='logonUser' :user-location='userLocation' />
    <MemberList :bus='bus' :user-location='userLocation' />
  </div>
</template>

<script>
import USERLOCATION from '@/events/userlocation'
import {loadUserLocationAPI} from '@/apis/client/userlocation'
import MyLocation from './MyLocation'
import MemberLocations from './MemberLocations'
import MemberList from './MemberList'

/**
 * Home Component
 * Home画面
 * @prop {VueInstance} bus Event Bus
 * @prop {Object} logonUser ログイン中のユーザー情報
 * @prop {Object} userSetting ログイン中ユーザーの設定値
 * @state {Object} userLocation ユーザーの位置情報
 */
export default {
  name: 'Home',
  props: ['bus', 'logonUser', 'userSetting'],
  components: {MyLocation, MemberLocations, MemberList},
  data () {
    return {
      userLocation: null
    }
  },
  created () {
    // XXX: これらはMyLocation Componentに持たせた方が良いかも知れない

    // ユーザー位置情報変更イベントのハンドリング
    this.bus.$on(USERLOCATION.CHANGED, location => {
      this.userLocation = location
      return true
    })
    // ユーザー位置情報APIの初期化
    loadUserLocationAPI(this.bus, this.userSetting.geolocationEnabled)
  }
}
</script>
