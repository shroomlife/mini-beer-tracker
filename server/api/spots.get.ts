import { prisma } from '~~/server/utils/prisma'
import { serializeSpot } from '~~/server/utils/spot'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)

  const near = typeof q.lat === 'string' && typeof q.lon === 'string'
    ? { lat: Number(q.lat), lon: Number(q.lon) }
    : null

  const rows = await prisma.spot.findMany({
    orderBy: { confirmedAt: 'desc' },
    take: 500,
  })

  if (!near || Number.isNaN(near.lat) || Number.isNaN(near.lon)) {
    return rows.map(r => serializeSpot(r))
  }

  return rows
    .map(r => ({ r, d: haversineKm(near.lat, near.lon, r.lat, r.lon) }))
    .sort((a, b) => a.d - b.d)
    .map(({ r, d }) => serializeSpot(r, d))
})

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}
function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}
