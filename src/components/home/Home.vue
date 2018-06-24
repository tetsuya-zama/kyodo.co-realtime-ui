<template>
  <MyLocation :bus='bus' :user-location='userLocation' :user-setting='userSetting' />
</template>

<script>
import USERLOCATION from '@/events/userlocation'
import {loadUserLocationAPI} from '@/apis/client/userlocation'
import MyLocation from './MyLocation'

export default {
  name: 'Home',
  props: ['bus', 'logonUser', 'userSetting'],
  components: {MyLocation},
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
