<template>
  <v-container fluid>
    <v-alert :value="errorMessage != ''" color="error" icon="mdi-alert">
      {{errorMessage}}
    </v-alert>
    <v-form v-model="valid">
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            id="userid"
            name="userid"
            label="ID"
            v-model="userid"
            :rules="useridRules"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            id="username"
            name="username"
            label="Name"
            v-model="username"
            :rules="usernameRules"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            id="mobile"
            name="mobile"
            label="携帯電話番号"
            v-model="mobile"
            :rules="mobileRules"
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
            :rules="passwordRules"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            id="passwordConfirm"
            name="passwordConfirm"
            label="password(confirm)"
            type="password"
            v-model="passwordConfirm"
            :rules="passwordConfirmRules"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-btn :disabled="!valid" block color="secondary" @click="onSignUpClick" dark>SignUp</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-layout row>
      <v-flex xs12>
        <v-btn block outline color="indigo" @click="$router.replace('/login')">ログイン画面に戻る</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import USER from '@/events/user'

/**
 * SignUp Component
 * ユーザー新規登録画面
 * @see https://vuetifyjs.com/ja/components/forms
 * @prop {VueInstance} bus Event Bus
 * @state {String} userId ユーザーID(入力値)
 * @state {Array} userIdRule ユーザーIDのバリデーションルール
 * @state {String} username ユーザー名(入力値)
 * @state {Array} usernameRules ユーザー名のバリデーションルール
 * @state {String} mobile 携帯電話番号(入力値)
 * @state {Array} mobileRule 携帯電話番号のバリデーションルール
 * @state {String} password パスワード(入力値)
 * @state {Array} passwordRule パスワードのバリデーションルール
 * @state {String} passwordConfirm 確認用パスワード(入力値)
 * @state {Array} passwordConfirmRules 確認用パスワードのバリデーションルール
 * @state {Boolean} valid バリデーションが通っているかどうか
 * @state {String} errorMessage 登録失敗時のエラーメッセージ
 */
export default{
  name: 'SignUp',
  props: ['bus'],
  data: function () {
    return {
      userid: '',
      useridRules: [
        v => !!v || 'useridは必須です',
        v => /^[a-zA-Z0-9-_.]*$/.test(v) || 'useridには半角英数と-_.が使用できます'
      ],
      username: '',
      usernameRules: [
        v => !!v || 'usernameは必須です'
      ],
      mobile: '',
      mobileRules: [
        v => !!v || '携帯電話番号は必須です',
        v => /^[0-9]*$/.test(v) || '携帯電話番号はハイフンなしの半角数字で入力してください。'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'passwordは必須です',
        v => /^[a-zA-Z0-9-_.]*$/.test(v) || 'useridには半角英数と-_.が使用できます'
      ],
      passwordConfirm: '',
      passwordConfirmRules: [
        v => !!v || 'password(confirm)は必須です',
        v => v === this.password || 'passwordとpassword(confirm)が一致しません'
      ],
      valid: false,
      errorMessage: ''
    }
  },
  created: function () {
    // サインアップ失敗イベントのハンドリング
    this.bus.$on(USER.SIGNUP_FAILURE, () => {
      this.errorMessage = '登録に失敗しました。IDが重複しています。'
    })
  },
  methods: {
    /**
     * サインアップボタン押下時のイベントハンドラ
     */
    onSignUpClick: function () {
      if (this.valid) {
        this.bus.$emit(USER.TRY_SIGNUP, {
          userId: this.userid,
          name: this.username,
          password: this.password,
          mobile: this.mobile
        })
      }
    }
  }
}
</script>
