import { prisma } from '~~/server/utils/prisma'
import { serializeSpot } from '~~/server/utils/spot'
import { grantXp } from '~~/server/utils/xp'
import { assertNoCooldown } from '~~/server/utils/spotAction'
import { XP_REWARDS, xpProgress } from '~~/shared/utils/xp'
import type { NewSpotInput, SpotActionResult } from '~~/shared/types/spot'

export default defineEventHandler(async (event): Promise<SpotActionResult> => {
  const session = await requireUserSession(event)
  const userId = session.user.id

  const body = await readBody<NewSpotInput>(event)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Missing body' })
  }
  const { name, address, lat, lon } = body
  if (!name || !address || typeof lat !== 'number' || typeof lon !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'name, address, lat, lon required' })
  }

  // Dedupe in einem kleinen Radius + gleicher Name → confirm statt create
  const recent = await prisma.spot.findMany({
    where: {
      lat: { gte: lat - 0.0005, lte: lat + 0.0005 },
      lon: { gte: lon - 0.0008, lte: lon + 0.0008 },
    },
    take: 20,
  })
  const match = recent.find(r => r.name.trim().toLowerCase() === name.trim().toLowerCase())

  if (match) {
    // Derselbe Spot wurde gerade bestätigt — kein XP-Farming via Re-Add
    await assertNoCooldown(userId, match.id, 'found')
    const updated = await prisma.spot.update({
      where: { id: match.id },
      data: {
        confirmedAt: new Date(),
        confirmCount: { increment: 1 },
        priceCents: body.priceCents ?? match.priceCents,
        vibe: body.vibe ?? match.vibe,
      },
    })
    await prisma.spotReport.create({
      data: { spotId: updated.id, userId, kind: 'found' },
    })
    const xp = await grantXp(userId, XP_REWARDS.SPOT_CONFIRMED)
    return {
      spot: serializeSpot(updated),
      xp: { ...xp, progress: xpProgress(xp.totalXp), reason: 'confirmed' },
    }
  }

  const created = await prisma.spot.create({
    data: {
      name: name.trim(),
      address: address.trim(),
      lat,
      lon,
      accuracyM: body.accuracyM ?? null,
      priceCents: body.priceCents ?? null,
      vibe: body.vibe ?? null,
      createdById: userId,
    },
  })
  await prisma.spotReport.create({
    data: { spotId: created.id, userId, kind: 'found' },
  })
  const xp = await grantXp(userId, XP_REWARDS.SPOT_CREATED)
  return {
    spot: serializeSpot(created),
    xp: { ...xp, progress: xpProgress(xp.totalXp), reason: 'created' },
  }
})
