<template>
  <v-toolbar app>
    <v-toolbar-title>map kyodo-co</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-menu bottom offset-y v-if="logonUser">
        <v-btn slot="activator" flat>
          <v-icon>mdi-account-outline</v-icon>{{logonUser.name}}
        </v-btn>
        <v-list>
          <v-list-tile  @click="onLogoutClick">
            <v-list-tile-content>
              <v-list-tile-title><v-icon>mdi-logout</v-icon>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import USER from '@/events/user'

export default {
  name: 'HeaderToolbar',
  props: ['bus', 'logonUser'],
  methods: {
    onLogoutClick: function () {
      this.bus.$emit(USER.TRY_LOGOUT)
    }
  }
}
</script>
