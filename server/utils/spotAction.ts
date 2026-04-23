import { prisma } from './prisma'

/**
 * Cooldown-Window: ein User darf denselben Spot nicht alle 10 Minuten
 * gleich mehrfach für dieselbe Aktion reporten. Verhindert XP-Farming
 * und Confidence-Manipulation durch Spam-Tapping.
 */
const COOLDOWN_MS = 10 * 60 * 1000

export async function assertNoCooldown(
  userId: string,
  spotId: string,
  kind: 'found' | 'not_found',
): Promise<void> {
  const since = new Date(Date.now() - COOLDOWN_MS)
  const recent = await prisma.spotReport.findFirst({
    where: { userId, spotId, kind, createdAt: { gte: since } },
    select: { id: true, createdAt: true },
  })
  if (recent) {
    const waitMs = COOLDOWN_MS - (Date.now() - recent.createdAt.getTime())
    const waitMin = Math.max(1, Math.ceil(waitMs / 60_000))
    throw createError({
      statusCode: 429,
      statusMessage: `Gleich nochmal? Probier's in ~${waitMin} Min. wieder.`,
    })
  }
}

export async function assertSpotExists(id: string): Promise<void> {
  const hit = await prisma.spot.findUnique({ where: { id }, select: { id: true } })
  if (!hit) {
    throw createError({ statusCode: 404, statusMessage: 'Spot nicht gefunden.' })
  }
}
