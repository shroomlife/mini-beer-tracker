import { prisma } from './prisma'
import { levelFromXp } from '~~/shared/utils/xp'

export interface XpGrantResult {
  totalXp: number
  gained: number
  leveledUp: boolean
  previousLevel: number
  newLevel: number
}

/**
 * Atomar XP vergeben und Level-Up erkennen.
 */
export async function grantXp(userId: string, amount: number): Promise<XpGrantResult> {
  const before = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  })
  const prevXp = before?.xp ?? 0
  const prevLevel = levelFromXp(prevXp)

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
    select: { xp: true },
  })
  const newLevel = levelFromXp(updated.xp)

  return {
    totalXp: updated.xp,
    gained: amount,
    leveledUp: newLevel > prevLevel,
    previousLevel: prevLevel,
    newLevel,
  }
}
