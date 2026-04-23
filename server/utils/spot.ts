import type { Spot as PrismaSpot } from '@prisma/client'
import { computeConfidence } from '~~/shared/utils/confidence'
import type { Spot } from '~~/shared/types/spot'

export function serializeSpot(s: PrismaSpot, distanceKm?: number): Spot {
  const confidence = computeConfidence({
    confirmCount: s.confirmCount,
    notFoundCount: s.notFoundCount,
    confirmedAt: s.confirmedAt,
    lastNotFoundAt: s.lastNotFoundAt,
  })
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    lat: s.lat,
    lon: s.lon,
    accuracyM: s.accuracyM,
    priceCents: s.priceCents,
    vibe: s.vibe,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    confirmedAt: s.confirmedAt.toISOString(),
    confirmCount: s.confirmCount,
    notFoundCount: s.notFoundCount,
    lastNotFoundAt: s.lastNotFoundAt ? s.lastNotFoundAt.toISOString() : null,
    createdById: s.createdById,
    confidence,
    ...(distanceKm != null ? { distanceKm } : {}),
  }
}
