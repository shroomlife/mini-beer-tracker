/**
 * "Wie wahrscheinlich gibt's hier aktuell Mini-Bier?"
 *
 * Laplace-Smoothed Bayesian Probability:
 *   P = (confirmCount + 1) / (confirmCount + notFoundCount + 2)
 *
 * → Ohne Daten: 50% (prior uniform)
 * → Mit einem "found": 66.6%
 * → Mit einem "not_found": 33.3%
 * → Konvergiert mit mehr Daten gegen den wahren Anteil.
 *
 * Zusätzlich Recency-Bias: wenn der letzte NotFound sehr frisch ist
 * und frischer als der letzte Found, ziehen wir P etwas runter.
 */

export interface ConfidenceInput {
  confirmCount: number
  notFoundCount: number
  confirmedAt?: Date | string | null
  lastNotFoundAt?: Date | string | null
}

export type ConfidenceTier = 'hot' | 'likely' | 'uncertain' | 'cold'

export interface Confidence {
  probability: number // 0..1
  percent: number // 0..100
  tier: ConfidenceTier
  label: string
  emoji: string
}

export function computeConfidence(input: ConfidenceInput): Confidence {
  const { confirmCount, notFoundCount } = input

  // Laplace smoothing
  let p = (confirmCount + 1) / (confirmCount + notFoundCount + 2)

  // Recency: wenn der letzte NotFound nach dem letzten Found lag
  // und jünger als 3 Tage ist, ziehen wir leicht runter.
  const found = toDate(input.confirmedAt)
  const notFound = toDate(input.lastNotFoundAt)
  if (notFound && (!found || notFound > found)) {
    const hoursAgo = (Date.now() - notFound.getTime()) / 3_600_000
    if (hoursAgo < 72) {
      const recencyPenalty = (1 - hoursAgo / 72) * 0.2 // bis -20%
      p = Math.max(p - recencyPenalty, 0.05)
    }
  }

  p = Math.min(Math.max(p, 0), 1)
  const percent = Math.round(p * 100)

  const { tier, label, emoji } = tierFor(p)
  return { probability: p, percent, tier, label, emoji }
}

function tierFor(p: number): { tier: ConfidenceTier, label: string, emoji: string } {
  if (p >= 0.75) return { tier: 'hot', label: 'Heiß', emoji: '🔥' }
  if (p >= 0.5) return { tier: 'likely', label: 'Wahrscheinlich', emoji: '👍' }
  if (p >= 0.25) return { tier: 'uncertain', label: 'Unsicher', emoji: '🤔' }
  return { tier: 'cold', label: 'Eher kalt', emoji: '🥶' }
}

function toDate(v: Date | string | null | undefined): Date | null {
  if (!v) return null
  if (v instanceof Date) return v
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}
