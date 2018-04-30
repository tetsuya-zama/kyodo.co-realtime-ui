import USERLOCATION from '@/events/userlocation'
import USERSETTING from '@/events/usersetting'

const GEOLOCATION_OPTION = {
  'enableHighAccuracy': true,
  'timeout': 8000,
  'maximumAge': 5000
}

let _instance = null

export function loadUserLocationAPI (bus, geolocationEnabled) {
  if (_instance == null) {
    _instance = new UserLocationAPI(bus, geolocationEnabled)
  }
}

class UserLocationAPI {
  constructor (bus, geolocationEnabled) {
    this.bus = bus
    this._setGeolocationEnabled(geolocationEnabled)

    this.bus.$on(USERSETTING.CHANGED, setting => this._setGeolocationEnabled(setting.geolocationEnabled))
  }

  _setGeolocationEnabled (geolocationEnabled) {
    this.geolocationEnabled = geolocationEnabled
    if (this.geolocationEnabled) {
      if (!this.watchId) {
        this._getLocation()
        this._watchLocation()
      }
    } else {
      this._clearWatchLocation()
    }
  }

  _getLocation () {
    window.navigator.geolocation.getCurrentPosition(
      position => this._onLocationSuccess(position),
      error => this._onLocationFailure(error),
      GEOLOCATION_OPTION
    )
  }

  _watchLocation () {
    this.watchId = window.navigator.geolocation.watchPosition(
      position => this._onLocationSuccess(position),
      error => this._onLocationError(error),
      GEOLOCATION_OPTION
    )
  }

  _clearWatchLocation () {
    if (this.watchId) {
      window.navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

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

  _onLocationFailure (error) {
    this.bus.$emit(USERLOCATION.ERROR, error)
  }
}
