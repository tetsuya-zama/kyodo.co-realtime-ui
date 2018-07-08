import USER from '@/events/user'
const LOGON_CACHE_STORAGE_KEY = 'logoncache'

let _instance = null

export function loadLogonCacheAPI (bus) {
  if (_instance == null) {
    _instance = new LogonCacheAPI(bus)
  }
}

export function getLogonCacheAPI () {
  if (_instance == null) {
    throw new Error('Logon Cache API has not been loaded')
  } else {
    return _instance
  }
}

class LogonCacheAPI {
  constructor (bus) {
    this.bus = bus
    this.storage = window.localStorage

    this.bus.$on(USER.LOGIN, userdata => this.setCache(userdata))
    this.bus.$on(USER.LOGOUT, () => this.removeCache())
  }

  setCache (userdata) {
    this.storage.setItem(LOGON_CACHE_STORAGE_KEY, JSON.stringify(userdata))
  }

  getCache () {
    const cache = this.storage.getItem(LOGON_CACHE_STORAGE_KEY)
    if (cache) {
      return JSON.parse(cache)
    } else {
      return null
    }
  }

  removeCache () {
    return this.storage.setItem(LOGON_CACHE_STORAGE_KEY, null)
  }
}
