<template>
  <v-container fluid>
    <v-alert :value="errorMessage != ''" color="warning" icon="mdi-alert">
      {{errorMessage}}
    </v-alert>
    <v-layout row>
      <v-flex xs12>
        <v-text-field
          id="userid"
          name="userid"
          label="ID"
          v-model="userid"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-text-field
          id="password"
          name="password"
          label="password"
          type="password"
          v-model="password"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-btn block color="secondary" @click="tryLogin" dark>Login</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-btn block outline color="indigo" @click="$router.replace('/signup')">新規ユーザー登録</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import USER from '@/events/user'
/**
 * Login Component
 * ログイン画面
 * @prop {VueInstance} bus Event Bus
 * @state {String} userid ユーザーID(入力値)
 * @state {String} password パスワード(入力値)
 * @state {String} errorMessage ログイン失敗時のエラーメッセージ
 */
export default {
  name: 'Login',
  props: ['bus'],
  data () {
    return {
      userid: '',
      password: '',
      errorMessage: ''
    }
  },
  created () {
    // ログイン失敗イベントのハンドリング
    this.bus.$on(USER.LOGIN_FAILURE, info => {
      this.errorMessage = 'ログインに失敗しました'
      return true
    })
  },
  methods: {
    /**
     * ログインボタン押下時のイベントハンドラ
     */
    tryLogin () {
      this.bus.$emit(USER.TRY_LOGIN, this.userid, this.password)
    }
  }
}
</script>
