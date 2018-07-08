import {loadLogonCacheAPI, getLogonCacheAPI} from '@/apis/client/storage/logoncache'
import {loadUserSettingAPI} from '@/apis/client/storage/usersetting'
import USER from '@/events/user'
import axios from 'axios'

let _instance = null

export function loadUserAPI (bus) {
  loadLogonCacheAPI(bus)

  if (_instance == null) {
    const logonCacheAPI = getLogonCacheAPI()
    const logonCache = logonCacheAPI.getCache()
    if (logonCache) {
      _instance = new UserAPI(bus, logonCache)
    } else {
      _instance = new UserAPI(bus)
      _instance.logout()
    }
  }
}

class UserAPI {
  constructor (bus, logonCache) {
    this.bus = bus
    this.bus.$on(USER.TRY_LOGIN, (id, pass) => this.login(id, pass))
    this.bus.$on(USER.TRY_LOGOUT, () => this.logout())
    this.bus.$on(USER.TRY_SIGNUP, newUser => this.signup(newUser))

    if (logonCache) {
      this.currentUser = logonCache
      loadUserSettingAPI(this.bus, this.currentUser.userId)
      this.bus.$emit(USER.LOGIN, this.currentUser)
    }
  }

  login (id, pass) {
    axios.post(process.env.ENDPOINT_BASE_URL + '/auth', {userId: id, password: pass})
      .then(response => {
        if (response.status === 200) {
          this.currentUser = Object.assign({}, response.data, {userId: id, password: pass})
          loadUserSettingAPI(this.bus, this.currentUser.userId)
          this.bus.$emit(USER.LOGIN, this.currentUser)
        }
      })
      .catch(() => {
        this.bus.$emit(USER.LOGIN_FAILURE, {reason: 'invelid id or pass'})
      })
  }

  logout () {
    if (this.currentUser) {
      axios.delete(process.env.ENDPOINT_BASE_URL + '/auth', {
        headers: {
          Authorization: 'Bearer ' + this.currentUser.token
        }
      }).then(response => {
        this.currentUser = null
        this.bus.$emit(USER.LOGOUT)
      }).catch(() => {
        // XXX: API側でエラー返してもクライアント側はログアウトするようにとりあえず実装
        this.currentUser = null
        this.bus.$emit(USER.LOGOUT)
      })
    } else {
      this.bus.$emit(USER.LOGOUT)
    }
  }

  signup (newUser) {
    axios.post(process.env.ENDPOINT_BASE_URL + '/user', newUser)
      .then(response => {
        if (response.status === 200) {
          this.bus.$emit(USER.SIGNUP_SUCCESS)
          loadUserSettingAPI(this.bus, newUser.userId)
          this.bus.$emit(USER.LOGIN, Object.assign(
            {},
            newUser,
            {token: response.data.token}
          ))
        }
      }).catch(() => {
        this.bus.$emit(USER.SIGNUP_FAILURE)
      })
  }
}
