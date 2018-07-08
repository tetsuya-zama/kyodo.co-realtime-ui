import USERLOCATION from '@/events/userlocation'
import USERSETTING from '@/events/usersetting'
import USER from '@/events/user'

/**
 * GeoLocationAPIの設定値
 */
const GEOLOCATION_OPTION = {
  'enableHighAccuracy': true,
  'timeout': 8000,
  'maximumAge': 5000
}

let _instance = null

/**
 * UserLocationAPIの初期化
 * @param {VueInstance} bus Event Bus
 * @param {Boolean} geolocationEnabled 「位置情報を共有」するかどうか
 */
export function loadUserLocationAPI (bus, geolocationEnabled) {
  if (_instance == null) {
    _instance = new UserLocationAPI(bus, geolocationEnabled)
  }
}

/**
 * UserLocationAPI
 * ユーザーの位置情報取得及び監視のためのAPI
 */
class UserLocationAPI {
  /**
   * コンストラクタ
   * @param {VueInstance} bus Event Bus
   * @param {Boolean} geolocationEnabled 「位置情報を共有」するかどうか
   */
  constructor (bus, geolocationEnabled) {
    this.bus = bus
    this._setGeolocationEnabled(geolocationEnabled)

    // ユーザー設定変更イベントのハンドリング
    this.bus.$on(USERSETTING.CHANGED, setting => this._setGeolocationEnabled(setting.geolocationEnabled))
    // ログアウトイベントのハンドリング
    this.bus.$on(USER.LOGOUT, () => this._clearWatchLocation())
  }

  /**
   * 「位置情報を共有」の値の設定
   */
  _setGeolocationEnabled (geolocationEnabled) {
    this.geolocationEnabled = geolocationEnabled
    // 「位置情報の共有」がONであれば監視を開始し、
    // OFFであれば監視を止める
    if (this.geolocationEnabled) {
      if (!this.watchId) {
        this._getLocation()
        this._watchLocation()
      }
    } else {
      this._clearWatchLocation()
    }
  }

  /**
   * 位置情報の取得
   */
  _getLocation () {
    window.navigator.geolocation.getCurrentPosition(
      position => this._onLocationSuccess(position),
      error => this._onLocationFailure(error),
      GEOLOCATION_OPTION
    )
  }

  /**
   * 位置情報の監視
   */
  _watchLocation () {
    this.watchId = window.navigator.geolocation.watchPosition(
      position => this._onLocationSuccess(position),
      error => this._onLocationFailure(error),
      GEOLOCATION_OPTION
    )
  }

  /**
   * 位置情報の監視を停止
   */
  _clearWatchLocation () {
    if (this.watchId) {
      window.navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  /**
   * 位置情報の取得成功時のイベントハンドラ
   */
  _onLocationSuccess (position) {
    this.position = {
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading
      },
      timestamp: position.timestamp
    }
    this.bus.$emit(USERLOCATION.CHANGED, this.position)
  }

  /**
   * 位置情報の取得失敗時のイベントハンドラ
   */
  _onLocationFailure (error) {
    this.bus.$emit(USERLOCATION.ERROR, error)
  }
}
