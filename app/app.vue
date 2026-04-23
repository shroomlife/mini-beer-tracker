<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'de' },
})

const route = useRoute()
// BottomNav nur in den App-Routes (/map, /spots, /add) anzeigen — Landing + Auth sollen clean bleiben.
const hideNav = computed(() => route.path === '/auth' || route.path === '/')

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
