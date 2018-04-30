<template>
    <div>
        <div>
            ようこそ{{logonUser.name}}さん
        </div>
        <div v-if='userSetting.geolocationEnabled'>
            <pre>
              {{JSON.stringify(userLocation, null, "  ")}}
            </pre>
        </div>
        <div>
            <input type='checkbox' id='geolocation-enabled' v-on:change='geoEnabledChange' v-bind:checked='userSetting.geolocationEnabled' />
            <label for='geolocation-enabled'>位置情報を共有する</label>
        </div>
        <div>
            <button v-on:click='tryLogout'>Logout</button>
        </div>
    </div>
</template>

<script>
import USER from '@/events/user'
import USERSETTING from '@/events/usersetting'
import USERLOCATION from '@/events/userlocation'
import {loadUserLocationAPI} from '@/apis/client/userlocation'

export default {
  name: 'Home',
  props: ['bus', 'logonUser', 'userSetting'],
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
  },
  methods: {
    tryLogout () {
      this.bus.$emit(USER.TRY_LOGOUT)
    },
    geoEnabledChange (event) {
      const val = event.target.checked
      console.dir(event.target)
      this.bus.$emit(USERSETTING.SET_SETTING, 'geolocationEnabled', val)
    }
  }
}
</script>
