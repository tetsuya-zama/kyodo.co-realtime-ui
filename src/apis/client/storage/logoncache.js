import USER from '@/events/user'
const LOGON_CACHE_STORAGE_KEY = 'logoncache'

let _instance = null
/**
 * LogonCacheAPIの初期化
 */
export function loadLogonCacheAPI (bus) {
  // Singleton Pattern
  if (_instance == null) {
    _instance = new LogonCacheAPI(bus)
  }
}

/**
 * LogonCacheAPIのインスタンス取得
 * @return {LogonCacheAPI} LogonCacheAPI
 */
export function getLogonCacheAPI () {
  if (_instance == null) {
    throw new Error('Logon Cache API has not been loaded')
  } else {
    return _instance
  }
}

/**
 * LogonCacheAPI
 * ログインしたままアプリを閉じ、再度アプリを開いた際に再認証を求められるのはかっこ悪いので、
 * LocalStorageにユーザー情報をキャッシュするためのAPI
 */
class LogonCacheAPI {
  /**
   * コンストラクタ
   * @param {VueInstance} bus Event Bus
   */
  constructor (bus) {
    this.bus = bus
    this.storage = window.localStorage
    // ログインイベントのハンドリング
    this.bus.$on(USER.LOGIN, userdata => this.setCache(userdata))
    // ログアウトイベントのハンドリング
    this.bus.$on(USER.LOGOUT, () => this.removeCache())
  }

  /**
   * キャッシュの作成
   * @param {Object} userdata ユーザー情報
   */
  setCache (userdata) {
    this.storage.setItem(LOGON_CACHE_STORAGE_KEY, JSON.stringify(userdata))
  }

  /**
   * キャッシュの取得
   * @return {Object} ユーザー情報。なければNull。
   */
  getCache () {
    const cache = this.storage.getItem(LOGON_CACHE_STORAGE_KEY)
    if (cache) {
      return JSON.parse(cache)
    } else {
      return null
    }
  }

  /**
   * キャッシュの削除
   */
  removeCache () {
    return this.storage.setItem(LOGON_CACHE_STORAGE_KEY, null)
  }
}
