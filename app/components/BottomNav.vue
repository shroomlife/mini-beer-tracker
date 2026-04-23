<script setup lang="ts">
const route = useRoute()

interface Tab {
  to: string
  icon: string
  label: string
}

const tabs: readonly Tab[] = [
  { to: '/map', icon: 'mdi:map-search-outline', label: 'Map' },
  { to: '/spots', icon: 'mdi:playlist-check', label: 'Spots' },
] as const

function isActive(to: string): boolean {
  if (to === '/map') return route.path === '/map'
  return route.path.startsWith(to)
}
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 safe-bottom pointer-events-none"
    aria-label="Hauptnavigation"
  >
    <div class="relative mx-auto max-w-md pointer-events-auto">
      <!-- Floating Action Button -->
      <div class="absolute left-1/2 -top-7 -translate-x-1/2 z-10">
        <NuxtLink
          to="/add"
          class="group relative grid place-items-center size-[72px] rounded-full bg-forest-600 text-cream-50 transition-all duration-200 hover:bg-forest-700"
          :class="route.path === '/add' ? 'ring-4 ring-malt-400/50' : ''"
          style="box-shadow: 0 12px 28px -8px rgba(17, 69, 48, 0.45), 0 4px 10px -2px rgba(17, 69, 48, 0.25), inset 0 0 0 4px #FDFBF4;"
          aria-label="Mini Beer Spot hinzufügen"
        >
          <div class="flex flex-col items-center leading-none">
            <Icon
              name="ph:plus-bold"
              class="size-7"
            />
            <span class="text-[9px] font-medium tracking-widest uppercase mt-1 text-malt-400">Neu</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Bar -->
      <div
        class="mx-4 mb-3 rounded-full bg-cream-50/95 backdrop-blur-lg border border-forest-100 grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2 px-3"
        style="box-shadow: 0 8px 32px -8px rgba(11, 22, 20, 0.14), 0 0 0 1px rgba(17, 69, 48, 0.04);"
      >
        <div class="flex justify-center">
          <NavTab
            :to="tabs[0]!.to"
            :icon="tabs[0]!.icon"
            :label="tabs[0]!.label"
            :active="isActive(tabs[0]!.to)"
          />
        </div>
        <div
          class="w-16"
          aria-hidden="true"
        />
        <div class="flex justify-center">
          <NavTab
            :to="tabs[1]!.to"
            :icon="tabs[1]!.icon"
            :label="tabs[1]!.label"
            :active="isActive(tabs[1]!.to)"
          />
        </div>
      </div>
    </div>
  </nav>
</template>
