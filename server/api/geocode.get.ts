import type { GeocodeResult } from '~~/shared/types/spot'

/**
 * Reverse-Geocode via OpenStreetMap Nominatim.
 * Server-proxied wegen CORS + um den User-Agent setzen zu können (Nominatim Usage Policy).
 */
export default defineEventHandler(async (event): Promise<GeocodeResult> => {
  // Sonst offener Nominatim-Relay unter unserem User-Agent → Gefahr dass
  // Nominatim den UA für alle User blockt.
  await requireUserSession(event)

  const { lat, lon } = getQuery(event)
  const config = useRuntimeConfig()

  if (typeof lat !== 'string' || typeof lon !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'lat & lon query required' })
  }
  const la = Number(lat)
  const lo = Number(lon)
  if (Number.isNaN(la) || Number.isNaN(lo)) {
    throw createError({ statusCode: 400, statusMessage: 'lat/lon must be numbers' })
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', String(la))
  url.searchParams.set('lon', String(lo))
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('zoom', '18')
  url.searchParams.set('accept-language', 'de,en')

  interface NominatimResponse {
    display_name?: string
    address?: {
      road?: string
      house_number?: string
      postcode?: string
      city?: string
      town?: string
      village?: string
      suburb?: string
      city_district?: string
    }
  }

  const res = await $fetch<NominatimResponse>(url.toString(), {
    headers: {
      'User-Agent': config.nominatimUserAgent,
      'Accept': 'application/json',
    },
    retry: 1,
    timeout: 6000,
  })

  const a = res.address ?? {}
  return {
    displayName: res.display_name ?? 'Unbekannte Adresse',
    road: a.road,
    houseNumber: a.house_number,
    postcode: a.postcode,
    city: a.city ?? a.town ?? a.village,
    suburb: a.suburb ?? a.city_district,
  }
})
