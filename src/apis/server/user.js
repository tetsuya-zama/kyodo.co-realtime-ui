import {loadLogonCacheAPI, getLogonCacheAPI} from '@/apis/client/storage/logoncache'
import {loadUserSettingAPI} from '@/apis/client/storage/usersetting'
import USER from '@/events/user'

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
      loadUserSettingAPI(this.bus, this.currentUser.id)
      this.bus.$emit(USER.LOGIN, this.currentUser)
    }
  }

  login (id, pass) {
    // Dummy Logic
    if (id === 'test' && pass === 'test') {
      this.currentUser = {id: 'test', name: 'テスト', email: 'test@example.com', token: 'dummytoken'}
      loadUserSettingAPI(this.bus, this.currentUser.id)
      this.bus.$emit(USER.LOGIN, this.currentUser)
    } else {
      this.bus.$emit(USER.LOGIN_FAILURE, {reason: 'invelid id or pass'})
    }
  }

  logout () {
    this.currentUser = null
    this.bus.$emit(USER.LOGOUT)
  }

  signup (newUser) {
    // Dummy Logic
    loadUserSettingAPI(this.bus, newUser.id)
    this.bus.$emit(USER.LOGIN, Object.assign({}, newUser, {token: 'dummyToken'}))
  }
}
