import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  // Nur eigene Spots löschen dürfen (oder wenn kein Owner gesetzt ist)
  const spot = await prisma.spot.findUnique({ where: { id } })
  if (!spot) return { ok: true }
  if (spot.createdById && spot.createdById !== session.user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Das ist nicht dein Spot.' })
  }

  await prisma.spot.delete({ where: { id } }).catch(() => null)
  return { ok: true }
})
