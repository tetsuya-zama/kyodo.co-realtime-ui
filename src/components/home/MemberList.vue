<template>
  <v-list two-line>
    <template v-for="(item, index) in allLocations">
      <v-divider
        :inset="item.inset"
        :key="index"
      ></v-divider>

      <v-list-tile
        :key="item.title"
        avatar
      >
        <v-list-tile-action>
          <v-btn icon :href=item.tellCall><v-icon>perm_phone_msg</v-icon></v-btn>
        </v-list-tile-action>


        <v-list-tile-content>
          <v-list-tile-title v-html="item.name"></v-list-tile-title>
          <v-list-tile-sub-title v-html="item.address"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
    </v-list>
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
  name: 'MemberList',
  props: ['bus', 'userLocation', 'searchCondition'],
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
  },
  methods: {

  },
  computed: {
    /**
     * 表示すべき位置情報の前処理
     */
    allLocations: function () {
      return this.locations.map(function (value) {
        var tellCall = 'tel:' + value.mobile
        value['tellCall'] = tellCall
        return value
      }).filter(location => {
        return  location.name.indexOf(this.searchCondition) > -1 || (location.address && location.address.indexOf(this.searchCondition)) > -1
      })
    }
  }
}
</script>
