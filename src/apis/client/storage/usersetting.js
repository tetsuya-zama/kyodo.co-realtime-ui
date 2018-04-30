import USERSETTING from '@/events/usersetting'

const DEFAULT_USER_SETTING = {
  geolocationEnabled: false
}

const SETTING_KEY_SUFFIX = 'setting'

let _instance = null

export function loadUserSettingAPI (bus, userid) {
  if (_instance == null) {
    _instance = new UserSettingAPI(bus, userid)
  }

  if (_instance.userid !== userid) {
    _instance.reload(userid)
  }
}

class UserSettingAPI {
  constructor (bus, userid) {
    this.bus = bus

    this.userid = userid
    this.settingKey = userid + '.' + SETTING_KEY_SUFFIX

    this.storage = window.localStorage

    this._loadSetting()
    this.bus.$on(USERSETTING.SET_SETTING, (key, value) => this.setSetting(key, value))
  }

  reload (userid) {
    this.userid = userid
    this.settingKey = userid + '.' + SETTING_KEY_SUFFIX

    this._loadSetting()
  }

  _loadSetting () {
    const currentSettingString = this.storage.getItem(this.settingKey)

    if (currentSettingString) {
      this.setting = Object.assign({}, DEFAULT_USER_SETTING, JSON.parse(currentSettingString))
    } else {
      this.setting = Object.assign({}, DEFAULT_USER_SETTING)
      this.storage.setItem(this.settingKey, JSON.stringify(this.setting))
    }

    this.bus.$emit(USERSETTING.CHANGED, this.setting)
  }

  setSetting (key, value) {
    this.setting[key] = value
    this.storage.setItem(this.settingKey, JSON.stringify(this.setting))

    this.bus.$emit(USERSETTING.CHANGED, this.setting)
  }
}
