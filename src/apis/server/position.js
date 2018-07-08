import USER from '@/events/user'
import USERLOCATION from '@/events/userlocation'
import MEMBERLOCATIONS from '@/events/memberlocations'
import axios from 'axios'

let _instance = null

export function loadPositionAPI (bus) {
  bus.$on(USER.LOGIN, logonUser => {
    _instance = new PositionAPI(bus, logonUser)
    _instance.startPolling()
    _instance.updatePositions()
  })

  bus.$on(USER.LOGOUT, () => {
    if (_instance) {
      _instance.endPolling()
    }
    _instance = null
  })

  bus.$on(MEMBERLOCATIONS.REFRESH, () => {
    if (_instance) {
      _instance.updatePositions()
    }
  })

  bus.$on(USERLOCATION.CHANGED, userLocation => {
    if (_instance) {
      _instance.sendUserLocation(userLocation)
    }
  })
}

class PositionAPI {
  constructor (bus, logonUser) {
    this.bus = bus
    this.logonUser = logonUser
    this.timerId = null
  }

  startPolling () {
    this.timerId = setInterval(
      () => {
        this.updatePositions()
      },
      process.env.POLLING_DURATION_MS
    )
  }

  endPolling () {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }

  updatePositions () {
    axios.get(
      process.env.ENDPOINT_BASE_URL + '/position/all',
      {
        headers: {
          Autorization: 'Bearer ' + this.logonUser.token
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
