<script setup lang="ts">
useSeoMeta({
  title: 'Deine Spots — Mini Beer Tracker',
  robots: 'noindex,nofollow',
})

const { spots, loading, refresh, confirm, notFound, remove } = useSpots()
const { coords, locate } = useCurrentLocation()
const { user } = useAuthUser()
const { logout } = useLogout()

onMounted(async () => {
  try {
    const c = await locate()
    await refresh({ lat: c.lat, lon: c.lon })
  }
  catch {
    await refresh()
  }
})

const sortBy = ref<'distance' | 'fresh' | 'popular' | 'confidence'>('distance')

const sortedSpots = computed(() => {
  const arr = [...spots.value]
  if (sortBy.value === 'fresh') {
    return arr.sort((a, b) => new Date(b.confirmedAt).getTime() - new Date(a.confirmedAt).getTime())
  }
  if (sortBy.value === 'popular') {
    return arr.sort((a, b) => b.confirmCount - a.confirmCount)
  }
  if (sortBy.value === 'confidence') {
    return arr.sort((a, b) => b.confidence.probability - a.confidence.probability)
  }
  return arr
})

const sortOptions = [
  { value: 'distance' as const, label: 'Nähe' },
  { value: 'confidence' as const, label: 'Wahrscheinlich' },
  { value: 'fresh' as const, label: 'Frisch' },
  { value: 'popular' as const, label: 'Bestätigt' },
]
</script>

<template>
  <main class="flex-1 flex flex-col safe-top px-4 md:px-6 pb-36">
    <header class="pt-6 pb-4 max-w-2xl mx-auto w-full">
      <div class="flex items-baseline justify-between gap-4">
        <div>
          <div class="text-[10px] uppercase tracking-[0.28em] text-malt-500 font-medium">
            Übersicht
          </div>
          <h1 class="mt-1 font-display text-3xl md:text-4xl font-semibold text-ink-900 leading-tight">
            Deine Spots
          </h1>
          <p class="mt-1 text-sm text-ink-500">
            {{ spots.length }} Späti{{ spots.length === 1 ? '' : 's' }} in der Sammlung
          </p>
        </div>
        <button
          type="button"
          class="btn-secondary size-10"
          aria-label="Neu laden"
          @click="coords ? refresh({ lat: coords.lat, lon: coords.lon }) : refresh()"
        >
          <Icon
            name="ph:arrows-clockwise-bold"
            class="size-4"
            :class="{ 'animate-spin': loading }"
          />
        </button>
      </div>

      <!-- Level card -->
      <div
        v-if="user"
        class="mt-6 rounded-[1.5rem] bg-ink-900 text-cream-50 p-5 flex items-center gap-4 relative overflow-hidden"
        style="box-shadow: 0 12px 36px -12px rgba(11, 22, 20, 0.3);"
      >
        <div
          aria-hidden="true"
          class="absolute -top-16 -right-16 size-48 rounded-full bg-forest-500/30 blur-3xl"
        />
        <div class="relative flex-1 min-w-0">
          <div class="text-[10px] uppercase tracking-[0.28em] text-malt-400 font-medium">
            {{ user.displayName || user.email }}
          </div>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="font-display text-2xl font-semibold tabular-nums">
              Level {{ user.progress.level }}
            </span>
            <span class="text-sm text-cream-100/70 font-display italic">
              · {{ user.progress.rank }}
            </span>
          </div>
          <div class="mt-3 h-1.5 w-full bg-ink-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full bg-malt-400 transition-all duration-700"
              :style="{ width: Math.round(user.progress.progress * 100) + '%' }"
            />
          </div>
          <div class="mt-1.5 font-mono text-[11px] text-cream-100/60 tabular-nums">
            {{ user.progress.xp }} / {{ user.progress.nextLevelXp }} XP
          </div>
        </div>
        <button
          type="button"
          class="relative shrink-0 text-[11px] uppercase tracking-widest text-cream-100/60 hover:text-cream-50 transition-colors"
          @click="logout"
        >
          Logout
        </button>
      </div>

      <!-- Sort tabs -->
      <div class="mt-6 inline-flex rounded-full bg-cream-50 border border-forest-100 p-1 text-xs font-medium">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          type="button"
          class="px-3.5 py-1.5 rounded-full transition-colors"
          :class="sortBy === opt.value ? 'bg-forest-700 text-cream-50' : 'text-ink-500 hover:text-forest-700'"
          @click="sortBy = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </header>

    <section
      v-if="loading && spots.length === 0"
      class="flex-1 grid place-items-center text-ink-500 text-sm"
    >
      Lade Spots…
    </section>

    <section
      v-else-if="spots.length === 0"
      class="flex-1 grid place-items-center text-center max-w-sm mx-auto px-4"
    >
      <div>
        <div class="font-display text-3xl md:text-4xl font-semibold text-ink-900 leading-tight">
          Noch keine Spots.
        </div>
        <p class="mt-3 text-sm text-ink-700 leading-relaxed">
          Beim nächsten Späti-Besuch: wenn da das kleine Heineken liegt, einfach auf das Plus in der Navigation unten tippen.
        </p>
        <NuxtLink
          to="/add"
          class="btn-primary mt-8 h-11 px-6 text-sm"
        >
          Ersten Spot anlegen
          <Icon
            name="ph:arrow-right-bold"
            class="ml-2 size-4"
          />
        </NuxtLink>
      </div>
    </section>

    <section
      v-else
      class="flex-1 flex flex-col gap-3 max-w-2xl mx-auto w-full"
    >
      <SpotCard
        v-for="spot in sortedSpots"
        :key="spot.id"
        :spot="spot"
        @confirm="(id) => confirm(id)"
        @not-found="(id) => notFound(id)"
        @remove="(id) => remove(id)"
      />
    </section>
  </main>
</template>
