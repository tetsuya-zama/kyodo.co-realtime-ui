<template>
  <div>
    <MyLocation :bus='bus' :user-location='userLocation' :user-setting='userSetting' />
    <SearchBox :bus='bus' />
    <MemberLocations :bus='bus' :logon-user='logonUser' :user-location='userLocation' :search-condition='searchCondition' />
    <MemberList :bus='bus' :user-location='userLocation' :search-condition='searchCondition' />
  </div>
</template>

<script>
import USERLOCATION from '@/events/userlocation'
import MEMBERLOCATIONS from '@/events/memberlocations'
import {loadUserLocationAPI} from '@/apis/client/userlocation'
import MyLocation from './MyLocation'
import MemberLocations from './MemberLocations'
import MemberList from './MemberList'
import SearchBox from './SearchBox'

/**
 * Home Component
 * Home画面
 * @prop {VueInstance} bus Event Bus
 * @prop {Object} logonUser ログイン中のユーザー情報
 * @prop {Object} userSetting ログイン中ユーザーの設定値
 * @state {Object} userLocation ユーザーの位置情報
 * @state {String} searchCondition 検索条件値
 */
export default {
  name: 'Home',
  props: ['bus', 'logonUser', 'userSetting'],
  components: {MyLocation, MemberLocations, MemberList, SearchBox},
  data () {
    return {
      userLocation: null,
      searchCondition: ''
    }
  },
  created () {
    // XXX: これらはMyLocation Componentに持たせた方が良いかも知れない

    // ユーザー位置情報変更イベントのハンドリング
    this.bus.$on(USERLOCATION.CHANGED, location => {
      this.userLocation = location
      return true
    })
    // 検索条件入力時イベントのハンドリング
    this.bus.$on(MEMBERLOCATIONS.FILTER, searchCondition => {
      this.searchCondition = searchCondition
      return true
    })
  
    
    // ユーザー位置情報APIの初期化
    loadUserLocationAPI(this.bus, this.userSetting.geolocationEnabled)
  }
}
</script>
