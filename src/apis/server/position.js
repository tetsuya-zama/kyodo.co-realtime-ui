import USER from '@/events/user'
import MEMBERLOCATIONS from '@/events/memberlocations'

let _instance = null

export function loadPositionAPI (bus) {
  bus.$on(USER.LOGIN, logonUser => {
    _instance = new PositionAPI(bus, logonUser.token)
    _instance.startPolling()
    _instance.updatePositions()
  })

  bus.$on(USER.LOGOUT, () => {
    _instance.endPolling()
    _instance = null
  })

  bus.$on(MEMBERLOCATIONS.REFRESH, () => {
    if (_instance) {
      _instance.updatePositions()
    }
  })
}

class PositionAPI {
  constructor (bus, token) {
    this.bus = bus
    this.token = token
    this.timerId = null
  }

  startPolling () {
    this.timerId = setInterval(
      () => {
        this.updatePositions()
      },
      5000 // XXX 設定ファイル等から取得？
    )
  }

  endPolling () {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }

  updatePositions () {
    // Dummy Logic
    const dummyResult = [
      {userid: 'userid123', position: { lat: 35.453793, lng: 139.597839 }, lastUpdate: '2017-03-31 15:30:31', name: '田中'},
      {userid: 'userid345', position: { lat: 35.676975, lng: 139.773328 }, lastUpdate: '2018-01-31 15:30:31', name: '鈴木'}
    ]

    this.bus.$emit(MEMBERLOCATIONS.UPDATED, dummyResult)
  }
}
