/**
 * XP / Level / Rank — reine Funktionen, shared zwischen Client und Server.
 * Kurve: quadratisch (25 * level^2) — macht frühe Level schnell erreichbar,
 * späte Level zur Prestige-Ziel.
 */

export const XP_REWARDS = {
  SPOT_CREATED: 50,
  SPOT_CONFIRMED: 10,
  SPOT_NOT_FOUND: 5, // auch Contribution
} as const

export const RANK_TITLES = [
  'Späti-Neuling', // 0
  'Mini-Scout', // 1
  'Berliner Kenner', // 2
  'Bierjäger', // 3
  'Mini-Magnat', // 4
  'Kiez-Chef', // 5
  'Heineken-Sommelier', // 6
  'Mini-Bier-Legende', // 7
  'Ewige Mini-Gottheit', // 8+
] as const

export const RANK_EMOJIS = ['🐣', '🔍', '🗺️', '🎯', '👑', '⭐', '🍾', '🏆', '🌟'] as const

/** XP-Schwelle für einen Level (Level 0 = 0, Level 1 = 25, Level 2 = 100, …) */
export function xpForLevel(level: number): number {
  if (level <= 0) return 0
  return 25 * level * level
}

/** Level aus XP ableiten. Level = floor(sqrt(xp / 25)) */
export function levelFromXp(xp: number): number {
  if (xp <= 0) return 0
  return Math.floor(Math.sqrt(xp / 25))
}

export function rankTitle(level: number): string {
  const i = Math.min(Math.max(level, 0), RANK_TITLES.length - 1)
  return RANK_TITLES[i]!
}

export function rankEmoji(level: number): string {
  const i = Math.min(Math.max(level, 0), RANK_EMOJIS.length - 1)
  return RANK_EMOJIS[i]!
}

export interface XpProgress {
  level: number
  rank: string
  emoji: string
  xp: number
  levelStartXp: number
  nextLevelXp: number
  xpInLevel: number
  xpNeededForNext: number
  progress: number // 0..1
}

export function xpProgress(xp: number): XpProgress {
  const level = levelFromXp(xp)
  const levelStartXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const xpInLevel = xp - levelStartXp
  const xpNeededForNext = Math.max(nextLevelXp - levelStartXp, 1)
  return {
    level,
    rank: rankTitle(level),
    emoji: rankEmoji(level),
    xp,
    levelStartXp,
    nextLevelXp,
    xpInLevel,
    xpNeededForNext,
    progress: Math.min(xpInLevel / xpNeededForNext, 1),
  }
}
