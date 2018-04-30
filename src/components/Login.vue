<template>
    <div>
        <dl>
            <dt>ID</dt>
            <dd><input type="text" v-model='userid' /></dd>
            <dt>Password</dt>
            <dd><input type="password" v-model='password' /></dd>
        </dl>
        <button v-on:click='tryLogin' >login</button>
        <span style='color:red'>{{errorMessage}}</span>
    </div>
</template>

<script>
import USER from '@/events/user'

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
    this.bus.$on(USER.LOGIN_FAILURE, info => {
      this.errorMessage = 'ログインに失敗しました'
      return true
    })
  },
  methods: {
    tryLogin () {
      this.bus.$emit(USER.TRY_LOGIN, this.userid, this.password)
    }
  }
}
</script>
