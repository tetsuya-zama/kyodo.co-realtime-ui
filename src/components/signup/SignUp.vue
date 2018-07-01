<template>
  <v-container fluid>
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
      valid: false
    }
  },
  methods: {
    onSignUpClick: function () {
      if (this.valid) {
        this.bus.$emit(USER.TRY_SIGNUP, {
          id: this.userid,
          name: this.username,
          password: this.password
        })
      }
    }
  }
}
</script>
