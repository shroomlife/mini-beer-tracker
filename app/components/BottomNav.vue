<script setup lang="ts">
const route = useRoute()

const tabs = [
  { to: '/', icon: 'mdi:map-search', label: 'Map' },
  { to: '/spots', icon: 'mdi:format-list-bulleted-square', label: 'Spots' },
] as const

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 safe-bottom pointer-events-none"
    aria-label="Hauptnavigation"
  >
    <div class="relative mx-auto max-w-md pointer-events-auto">
      <!-- FAB center button -->
      <div class="absolute left-1/2 -top-8 -translate-x-1/2 z-10">
        <NuxtLink
          to="/add"
          class="btn-chunk grid place-items-center size-20 rounded-full bg-brand-500 text-white border-4 border-cream-100 shadow-chunk hover:bg-brand-600"
          :class="{ 'ring-4 ring-sun-500/70': route.path === '/add' }"
          aria-label="Mini Beer Spot hinzufügen"
        >
          <div class="flex flex-col items-center leading-none">
            <span class="text-3xl">🍺</span>
            <span class="text-[9px] font-display font-bold mt-0.5">HIER!</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Bar -->
      <div class="mx-3 mb-2 rounded-[28px] bg-white/90 backdrop-blur shadow-[0_-4px_30px_rgba(0,0,0,0.08)] border border-brand-100 px-4 pt-2 pb-3 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div class="flex justify-around">
          <NavTab
            v-for="t in tabs.slice(0, 1)"
            :key="t.to"
            :to="t.to"
            :icon="t.icon"
            :label="t.label"
            :active="isActive(t.to)"
          />
        </div>
        <!-- Spacer for FAB -->
        <div
          class="w-20"
          aria-hidden="true"
        />
        <div class="flex justify-around">
          <NavTab
            v-for="t in tabs.slice(1)"
            :key="t.to"
            :to="t.to"
            :icon="t.icon"
            :label="t.label"
            :active="isActive(t.to)"
          />
        </div>
      </div>
    </div>
  </nav>
</template>
