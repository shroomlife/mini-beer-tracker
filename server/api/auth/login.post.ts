import { prisma } from '~~/server/utils/prisma'
import { verifyUserPassword } from '~~/server/utils/password'
import { xpProgress } from '~~/shared/utils/xp'
import type { SessionUser } from '~~/shared/types/spot'

interface LoginBody {
  email?: string
  password?: string
}

export default defineEventHandler(async (event): Promise<{ user: SessionUser }> => {
  const body = await readBody<LoginBody>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email und Passwort sind Pflicht' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Email oder Passwort falsch' })
  }

  const ok = await verifyUserPassword(password, user.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Email oder Passwort falsch' })
  }

  await setUserSession(event, {
    user: { id: user.id, email: user.email, displayName: user.displayName },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      xp: user.xp,
      progress: xpProgress(user.xp),
    },
  }
})
