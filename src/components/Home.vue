<template>
    <div>
        <div>
            ようこそ{{logonUser.name}}さん
        </div>
        <div v-if='userSetting.geolocationEnabled'>
            <div v-if='location'>
              <dl>
                <dt>緯度</dt>
                <dd>{{location.coords.latitude}}</dd>
                <dt>経度</dt>
                <dd>{{location.coords.longitude}}</dd>
                <dt>時刻</dt>
                <dd>{{location.timestamp}}</dd>
              </dl>
            </div>
            <div v-else>
              位置情報取得中...
            </div>
        </div>
        <div v-else>
          位置情報共有停止中
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
      this.bus.$emit(USERSETTING.SET_SETTING, 'geolocationEnabled', val)
    }
  },
  computed: {
    location () {
      if (!this.userLocation) {
        return null
      }
      const timestampDate = new Date(this.userLocation.timestamp).toLocaleString()
      return Object.assign({}, this.userLocation, {timestamp: timestampDate})
    }
  }
}
</script>
