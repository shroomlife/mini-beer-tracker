import type { XpGain } from '~~/shared/types/spot'

export interface XpToastItem {
  id: number
  gained: number
  reason: XpGain['reason']
  emoji: string
}

/**
 * Global state für Feedback-Ebene:
 *  - Toast-Queue für +XP-Meldungen
 *  - Level-Up-Overlay-Trigger
 */
export function useXpFeedback() {
  const toasts = useState<XpToastItem[]>('xp:toasts', () => [])
  const levelUp = useState<XpGain | null>('xp:levelup', () => null)
  const { celebrate: celebrateHaptic, success: successHaptic } = useHaptic()
  const { user, patchXp, refresh } = useAuthUser()

  const REASON_EMOJI: Record<XpGain['reason'], string> = {
    created: '🍺',
    confirmed: '✅',
    not_found: '🕵️',
  }

  function trigger(gain: XpGain): void {
    // Update user XP im State
    patchXp(gain.totalXp)
    // Fire-and-forget Refresh, damit Progress korrekt neu berechnet wird
    refresh().catch(() => { /* ignore */ })

    const toast: XpToastItem = {
      id: Date.now() + Math.random(),
      gained: gain.gained,
      reason: gain.reason,
      emoji: REASON_EMOJI[gain.reason],
    }
    toasts.value = [...toasts.value, toast]
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== toast.id)
    }, 1800)

    if (gain.leveledUp) {
      levelUp.value = gain
      celebrateHaptic()
    }
    else {
      successHaptic()
    }
  }

  function dismissLevelUp(): void {
    levelUp.value = null
  }

  return { toasts, levelUp, trigger, dismissLevelUp, user }
}
