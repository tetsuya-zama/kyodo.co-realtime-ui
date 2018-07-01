<template>
  <div>
    <MyLocation :bus='bus' :user-location='userLocation' :user-setting='userSetting' />
    <MemberLocations :bus='bus' :logon-user='logonUser' :user-location='userLocation' />
  </div>
</template>

<script>
import USERLOCATION from '@/events/userlocation'
import {loadUserLocationAPI} from '@/apis/client/userlocation'
import MyLocation from './MyLocation'
import MemberLocations from './MemberLocations'

export default {
  name: 'Home',
  props: ['bus', 'logonUser', 'userSetting'],
  components: {MyLocation, MemberLocations},
  data () {
    return {
      userLocation: null
    }
  },
  created () {
    this.bus.$on(USERLOCATION.CHANGED, location => {
      this.userLocation = location
      return true
    })

    loadUserLocationAPI(this.bus, this.userSetting.geolocationEnabled)
  }
}
</script>
