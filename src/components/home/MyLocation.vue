<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <div>
              <h3 class="headline mb-0">自分の位置情報</h3>
            </div>
          </v-card-title>
          <v-card-text>
              <v-list two-line v-if='userSetting.geolocationEnabled && location'>
                <v-list-tile>
                  <v-list-tile-avatar>
                    <v-icon class="mdi-48px">mdi-earth</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>緯度</v-list-tile-title>
                    <v-list-tile-sub-title>{{location.coords.latitude}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-avatar>
                    <v-icon class="mdi-48px">mdi-earth</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>経度</v-list-tile-title>
                    <v-list-tile-sub-title>{{location.coords.longitude}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-avatar>
                    <v-icon class="mdi-48px">mdi-clock</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>取得時刻</v-list-tile-title>
                    <v-list-tile-sub-title>{{location.timestamp}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-alert :value="userSetting.geolocationEnabled && !location" color="info" icon="mdi-clock-alert">
                位置情報取得中
              </v-alert>
              <v-alert :value="!userSetting.geolocationEnabled" color="warning" icon="mdi-alert">
                位置情報共有停止中
              </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-switch label="位置情報を共有する" @change="geoEnabledChange" v-model="userSetting.geolocationEnabled"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import USERSETTING from '@/events/usersetting'

/**
 * MyLocation Component
 * 自分の位置情報パネル
 * @prop {VueInstance} bus Event Bus
 * @prop {Object} userLocation ユーザーの位置情報
 * @prop {Object} userSetting ユーザーの設定値
 */
export default {
  name: 'MyLocation',
  props: ['bus', 'userLocation', 'userSetting'],
  methods: {
    /**
     * 「位置情報を共有する」設定の切り替え時のイベントハンドラ
     */
    geoEnabledChange (val) {
      this.bus.$emit(USERSETTING.SET_SETTING, 'geolocationEnabled', val)
    }
  },
  computed: {
    /**
     * 表示する位置情報の前処理
     */
    location () {
      if (!this.userLocation) {
        return null
      }
      // GeoLocationAPIのtimestampはUNIX TIMEで返ってくるので、表示用に文字列に変換
      const timestampDate = new Date(this.userLocation.timestamp).toLocaleString()
      return Object.assign({}, this.userLocation, {timestamp: timestampDate})
    }
  }
}
</script>
