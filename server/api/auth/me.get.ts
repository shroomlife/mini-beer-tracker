import { prisma } from '~~/server/utils/prisma'
import { xpProgress } from '~~/shared/utils/xp'
import type { SessionUser } from '~~/shared/types/spot'

export default defineEventHandler(async (event): Promise<{ user: SessionUser | null }> => {
  const session = await getUserSession(event)
  if (!session.user) return { user: null }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, displayName: true, xp: true },
  })
  if (!user) return { user: null }

  return {
    user: {
      ...user,
      progress: xpProgress(user.xp),
    },
  }
})
