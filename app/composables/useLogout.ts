export function useLogout() {
  const { clear } = useUserSession()
  const router = useRouter()

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    await clear()
    await router.replace('/auth')
  }

  return { logout }
}
