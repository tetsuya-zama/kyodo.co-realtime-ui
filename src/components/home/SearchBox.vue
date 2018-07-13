<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-layout row>
          <v-flex xs4>
            <v-text-field
              append-icon="search"
              name="userid"
              placeholder="絞り込む条件を入力してください。"
              @input="onTextChange"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
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
  name: 'SearchBox',
  props: ['bus'],
  data: function () {
    return {
      searchCondition: ''
    }
  },
  created: function () {

  },
  methods: {
    onTextChange: function (searchCondition) {
        this.bus.$emit(MEMBERLOCATIONS.FILTER, searchCondition)
    }
  },
  computed: {

  }
}
</script>