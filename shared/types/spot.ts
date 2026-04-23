import type { Confidence } from '~~/shared/utils/confidence'
import type { XpProgress } from '~~/shared/utils/xp'

export interface Spot {
  id: string
  name: string
  address: string
  lat: number
  lon: number
  accuracyM: number | null
  priceCents: number | null
  vibe: string | null
  createdAt: string
  updatedAt: string
  confirmedAt: string
  confirmCount: number
  notFoundCount: number
  lastNotFoundAt: string | null
  createdById: string | null
  confidence: Confidence
  distanceKm?: number
}

export interface NewSpotInput {
  name: string
  address: string
  lat: number
  lon: number
  accuracyM?: number | null
  priceCents?: number | null
  vibe?: string | null
}

export interface GeocodeResult {
  displayName: string
  road?: string
  houseNumber?: string
  postcode?: string
  city?: string
  suburb?: string
}

export interface XpGain {
  gained: number
  totalXp: number
  leveledUp: boolean
  previousLevel: number
  newLevel: number
  progress: XpProgress
  reason: 'created' | 'confirmed' | 'not_found'
}

export interface SpotActionResult {
  spot: Spot
  xp: XpGain
}

export interface SessionUser {
  id: string
  email: string
  displayName: string | null
  xp: number
  progress: XpProgress
}
