export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  const publicRoutes = new Set(['/auth'])

  if (!loggedIn.value && !publicRoutes.has(to.path)) {
    return navigateTo('/auth')
  }
})
