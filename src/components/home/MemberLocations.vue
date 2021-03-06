<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <div>
              <h3 class="headline mb-0">みんなの位置</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <GmapMap
              v-if="allLocations.length > 0"
              :center="allLocations[0].position"
              :zoom="9"
              map-type-id="terrain"
              style="width: auto; height: 300px"
            >
              <GmapMarker
                :key="index"
                v-for="(location, index) in allLocations"
                :position="location.position"
                :title="location.name + '(' + location.lastUpdate + ')'"
                :label="location.name.substr(0,1)"
                :clickable="true"
                :draggable="false"
              />
            </GmapMap>
          </v-card-text>
          <v-card-actions>
            <v-btn flat icon color="green" @click="onRefresh"><v-icon>cached</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MEMBERLOCATIONS from '@/events/memberlocations'

/**
 * MemberLocation Component
 * みんなの位置パネル
 * @see https://github.com/Akryum/vue-googlemaps
 * @prop {VueInstance} bus Event Bus
 * @prop {Object} logonUser ログイン中のユーザー情報
 * @prop {Object} userLocation ログオンユーザーの位置情報
 * @state {Array} locations マップ上に表示すべき位置情報
 */
export default {
  name: 'MemberLocations',
  props: ['bus', 'logonUser', 'userLocation'],
  data: function () {
    return {
      locations: []
    }
  },
  created: function () {
    // みんなの位置情報更新イベントのハンドリング
    this.bus.$on(MEMBERLOCATIONS.UPDATED, locations => {
      this.locations = locations
      return true
    })
    this.onRefresh()
  },
  methods: {
    /**
     * 更新アイコン押下時のイベントハンドラ
     */
    onRefresh: function () {
      this.bus.$emit(MEMBERLOCATIONS.REFRESH)
    }
  },
  computed: {
    /**
     * 表示すべき位置情報の前処理
     */
    allLocations: function () {
      // TODO: サーバサイドAPIが未完成であるため暫定処理。完成したら直す。
      if (this.logonUser && this.userLocation) {
        const myLocation = {
          userId: this.logonUser.userId,
          name: this.logonUser.name,
          position: {
            lat: this.userLocation.coords.latitude,
            lng: this.userLocation.coords.longitude
          },
          lastUpdate: new Date(this.userLocation.timestamp).toLocaleString()
        }

        return [myLocation].concat(this.locations.filter(l => l.userId !== this.logonUser.userId))
      } else {
        return this.locations
      }
    }
  }
}
</script>
