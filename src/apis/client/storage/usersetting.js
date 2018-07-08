import USERSETTING from '@/events/usersetting'
import USER from '@/events/user'

const DEFAULT_USER_SETTING = {
  geolocationEnabled: false
}

const SETTING_KEY_SUFFIX = 'setting'

let _instance = null

/**
 * ユーザー情報APIの初期化
 * @param {VueInstance} bus Event Bus
 * @param {String} userid ログイン中のユーザーID
 */
export function loadUserSettingAPI (bus, userid) {
  // Singleton Pattern
  if (_instance == null) {
    _instance = new UserSettingAPI(bus, userid)
  }

  if (_instance.userid !== userid) {
    _instance.reload(userid)
  }
}

/**
 * UserSettingAPI
 * ユーザーごとの設定情報をLocalStorgeに保存するためのAPI
 */
class UserSettingAPI {
  /**
   * コンストラクタ
   * @param {VueInstance} bus Event Bus
   * @param {String} userid ログイン中のユーザーID
   */
  constructor (bus, userid) {
    this.bus = bus

    this.userid = userid
    this.settingKey = userid + '.' + SETTING_KEY_SUFFIX

    this.storage = window.localStorage

    this._loadSetting()
    this.bus.$on(USERSETTING.SET_SETTING, (key, value) => this.setSetting(key, value))
    this.bus.$on(USER.LOGIN, user => this.reload(user.userId))
  }

  /**
   * ユーザーIDの再設定
   * @param {String} userid ユーザーID
   */
  reload (userid) {
    this.userid = userid
    this.settingKey = userid + '.' + SETTING_KEY_SUFFIX

    this._loadSetting()
  }

  /**
   * 設定情報の読み込み
   */
  _loadSetting () {
    const currentSettingString = this.storage.getItem(this.settingKey)

    // すでにLocalStorageにあればそれを使用し、
    // なければ初期状態で新たに作成する
    if (currentSettingString) {
      this.setting = Object.assign({}, DEFAULT_USER_SETTING, JSON.parse(currentSettingString))
    } else {
      this.setting = Object.assign({}, DEFAULT_USER_SETTING)
      this.storage.setItem(this.settingKey, JSON.stringify(this.setting))
    }

    this.bus.$emit(USERSETTING.CHANGED, this.setting)
  }

  /**
   * 設定の変更
   * @param {String} key 設定のkey
   * @param {String} value 設定の値
   */
  setSetting (key, value) {
    this.setting[key] = value
    this.storage.setItem(this.settingKey, JSON.stringify(this.setting))

    this.bus.$emit(USERSETTING.CHANGED, this.setting)
  }
}
