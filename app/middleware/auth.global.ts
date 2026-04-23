export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  // Public-Pages — keine Session nötig.
  const publicRoutes = new Set(['/', '/auth'])

  if (publicRoutes.has(to.path)) {
    // Eingeloggter User auf Landing? → direkt in die App.
    if (to.path === '/' && loggedIn.value) {
      return navigateTo('/map')
    }
    return
  }

  if (!loggedIn.value) {
    return navigateTo('/auth')
  }
})
