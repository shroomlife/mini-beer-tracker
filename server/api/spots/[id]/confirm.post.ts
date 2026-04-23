import { prisma } from '~~/server/utils/prisma'
import { serializeSpot } from '~~/server/utils/spot'
import { grantXp } from '~~/server/utils/xp'
import { assertNoCooldown, assertSpotExists } from '~~/server/utils/spotAction'
import { XP_REWARDS, xpProgress } from '~~/shared/utils/xp'
import type { SpotActionResult } from '~~/shared/types/spot'

export default defineEventHandler(async (event): Promise<SpotActionResult> => {
  const session = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  await assertSpotExists(id)
  await assertNoCooldown(session.user.id, id, 'found')

  const updated = await prisma.spot.update({
    where: { id },
    data: {
      confirmedAt: new Date(),
      confirmCount: { increment: 1 },
    },
  })
  await prisma.spotReport.create({
    data: { spotId: id, userId: session.user.id, kind: 'found' },
  })
  const xp = await grantXp(session.user.id, XP_REWARDS.SPOT_CONFIRMED)
  return {
    spot: serializeSpot(updated),
    xp: { ...xp, progress: xpProgress(xp.totalXp), reason: 'confirmed' },
  }
})
