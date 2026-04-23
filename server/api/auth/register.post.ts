import { prisma } from '~~/server/utils/prisma'
import { hashUserPassword } from '~~/server/utils/password'
import { xpProgress } from '~~/shared/utils/xp'
import type { SessionUser } from '~~/shared/types/spot'

interface RegisterBody {
  email?: string
  password?: string
  displayName?: string
}

export default defineEventHandler(async (event): Promise<{ user: SessionUser }> => {
  const body = await readBody<RegisterBody>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const displayName = body.displayName?.trim() || null

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email und Passwort sind Pflicht' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Email' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Passwort muss mind. 8 Zeichen haben' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    // Bewusst generische Message — kein Email-Enumeration-Leak.
    throw createError({
      statusCode: 400,
      statusMessage: 'Registrierung nicht möglich. Versuch dich einzuloggen oder nimm eine andere Email.',
    })
  }

  const passwordHash = await hashUserPassword(password)
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName },
    select: { id: true, email: true, displayName: true, xp: true },
  })

  await setUserSession(event, {
    user: { id: user.id, email: user.email, displayName: user.displayName },
  })

  return {
    user: {
      ...user,
      progress: xpProgress(user.xp),
    },
  }
})
