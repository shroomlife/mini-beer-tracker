import type { SessionUser } from '~~/shared/types/spot'
import { xpProgress } from '~~/shared/utils/xp'

/**
 * Hydratisierter User inkl. XP/Level. useUserSession() aus nuxt-auth-utils
 * liefert nur die Session-Payload — wir holen das XP-Profil aus /api/auth/me,
 * damit wir nach Actions ohne Session-Rotation XP & Level aktualisieren können.
 */
export function useAuthUser() {
  const user = useState<SessionUser | null>('auth:user', () => null)
  const { loggedIn } = useUserSession()

  async function refresh(): Promise<void> {
    // Client-only: vermeidet einen Nitro-internen Loopback während SSR.
    // Session/Middleware laufen SSR-safe via useUserSession — diese Funktion
    // hydratisiert nur zusätzlich XP/Level auf Client-Seite.
    if (!import.meta.client) return
    if (!loggedIn.value) {
      user.value = null
      return
    }
    const res = await $fetch<{ user: SessionUser | null }>('/api/auth/me')
    user.value = res.user
  }

  function patchXp(totalXp: number): void {
    if (!user.value) return
    user.value = {
      ...user.value,
      xp: totalXp,
      progress: (user.value.progress && totalXp === user.value.xp)
        ? user.value.progress
        : xpProgress(totalXp),
    }
  }

  return { user, refresh, patchXp }
}
