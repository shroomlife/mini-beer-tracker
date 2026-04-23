export interface CurrentLocation {
  lat: number
  lon: number
  accuracy: number
}

export function useCurrentLocation() {
  const coords = ref<CurrentLocation | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function locate(options?: PositionOptions): Promise<CurrentLocation> {
    loading.value = true
    error.value = null
    try {
      if (!import.meta.client || !('geolocation' in navigator)) {
        throw new Error('Geolocation nicht verfügbar')
      }
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12_000,
          maximumAge: 0,
          ...options,
        })
      })
      const loc: CurrentLocation = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      }
      coords.value = loc
      return loc
    }
    catch (e) {
      const msg = e instanceof GeolocationPositionError
        ? geoErrorMsg(e)
        : (e instanceof Error ? e.message : 'Unbekannter Fehler')
      error.value = msg
      throw new Error(msg)
    }
    finally {
      loading.value = false
    }
  }

  return { coords, error, loading, locate }
}

function geoErrorMsg(e: GeolocationPositionError): string {
  switch (e.code) {
    case e.PERMISSION_DENIED: return 'Standort-Zugriff verweigert. Bitte in den Browser-Einstellungen erlauben.'
    case e.POSITION_UNAVAILABLE: return 'Standort konnte nicht ermittelt werden.'
    case e.TIMEOUT: return 'Standort-Abfrage hat zu lange gedauert.'
    default: return 'Standort-Fehler.'
  }
}
