import USER from '@/events/user'
import USERLOCATION from '@/events/userlocation'
import MEMBERLOCATIONS from '@/events/memberlocations'
import axios from 'axios'

let _instance = null
/**
 * PositionAPIの初期化
 * @param {VueInstance} bus Event Bus
 */
export function loadPositionAPI (bus) {
  // Singleton Pattern

  // ユーザーログイン時
  bus.$on(USER.LOGIN, logonUser => {
    _instance = new PositionAPI(bus, logonUser)
    _instance.startPolling()
    _instance.updatePositions()
  })

  // ユーザーログアウト時
  bus.$on(USER.LOGOUT, () => {
    if (_instance) {
      _instance.endPolling()
    }
    _instance = null
  })

  // みんなの位置情報の更新要求時
  bus.$on(MEMBERLOCATIONS.REFRESH, () => {
    if (_instance) {
      _instance.updatePositions()
    }
  })

  // ユーザーの位置情報の変更時
  bus.$on(USERLOCATION.CHANGED, userLocation => {
    if (_instance) {
      _instance.sendUserLocation(userLocation)
    }
  })
}

/**
 * PositionAPI
 * 位置情報に関するサーバサイドAPIへの接続をするためのAPI
 */
class PositionAPI {
  /**
   * コンストラクタ
   * @param {VueInstance} bus Event Bus
   * @param {Object} logonUser ログイン中のユーザー情報
   */
  constructor (bus, logonUser) {
    this.bus = bus
    this.logonUser = logonUser
    this.timerId = null
  }

  /**
   * みんなの位置情報に対するPollingの開始
   */
  startPolling () {
    this.timerId = setInterval(
      () => {
        this.updatePositions()
      },
      process.env.POLLING_DURATION_MS
    )
  }

  /**
   * みんなの位置情報に対するPollingの停止
   */
  endPolling () {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }

  /**
   * みんなの位置情報の再取得
   */
  updatePositions () {
    axios.get(
      process.env.ENDPOINT_BASE_URL + '/position/all',
      {
        headers: {
          Authorization: 'Bearer ' + this.logonUser.token
        }
      }
    ).then(response => {
      if (response.status === 200) {
        this.bus.$emit(MEMBERLOCATIONS.UPDATED, response.data)
      }
    }).catch(() => {
      // Dummy Logic
      // TODO: API側が実装されたら消す
      const dummyResult = [
        {userid: 'userid123', position: { lat: 35.453793, lng: 139.597839 }, lastUpdate: '2017-03-31 15:30:31', name: '田中'},
        {userid: 'userid345', position: { lat: 35.676975, lng: 139.773328 }, lastUpdate: '2018-01-31 15:30:31', name: '鈴木'}
      ]

      this.bus.$emit(MEMBERLOCATIONS.UPDATED, dummyResult)
    })
  }

  /**
   * 自分の位置情報の送信
   */
  sendUserLocation (userLocation) {
    axios.post(
      process.env.ENDPOINT_BASE_URL + '/user/' + this.logonUser.userId + '/position',
      {
        position: {
          lat: userLocation.coords.latitude,
          lng: userLocation.coords.longitude
        }
      },
      {
        headers: {
          Authorization: 'Bearer ' + this.logonUser.token
        }
      }
    )
  }
}
