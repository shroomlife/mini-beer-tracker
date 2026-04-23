<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'de' },
})

const route = useRoute()
const hideNav = computed(() => route.path === '/auth')

const { loggedIn } = useUserSession()
const { refresh: refreshUser } = useAuthUser()
watch(loggedIn, (v) => {
  if (v) refreshUser().catch(() => { /* ignore */ })
}, { immediate: true })
</script>

<template>
  <div class="relative min-h-full flex flex-col">
    <NuxtPage />
    <BottomNav v-if="!hideNav" />
    <ClientOnly>
      <XpToastLayer />
      <LevelUpOverlay />
    </ClientOnly>
  </div>
</template>
