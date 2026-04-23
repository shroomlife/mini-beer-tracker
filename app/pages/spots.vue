<script setup lang="ts">
useHead({ title: 'Alle Mini-Beer-Spots' })

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
</script>

<template>
  <main class="flex-1 flex flex-col safe-top px-4 pb-28">
    <header class="pt-3 pb-2">
      <div class="flex items-center gap-3">
        <div class="text-4xl animate-wiggle">
          🍺
        </div>
        <div class="flex-1">
          <h1 class="font-display text-2xl font-extrabold leading-none">
            Deine Mini-Beer-Spots
          </h1>
          <p class="text-xs text-brand-900/60 mt-1">
            {{ spots.length }} Späti{{ spots.length === 1 ? '' : 's' }} in der Sammlung
          </p>
        </div>
        <button
          type="button"
          class="btn-chunk size-10 rounded-xl bg-white border border-brand-200"
          aria-label="Neu laden"
          @click="coords ? refresh({ lat: coords.lat, lon: coords.lon }) : refresh()"
        >
          <Icon
            name="mdi:refresh"
            class="size-5"
            :class="{ 'animate-spin': loading }"
          />
        </button>
      </div>

      <!-- Level/XP Card -->
      <div
        v-if="user"
        class="mt-3 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white p-4 border-2 border-white shadow-[0_6px_0_0_#004026] flex items-center gap-3"
      >
        <div class="text-4xl">
          {{ user.progress.emoji }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline justify-between gap-2">
            <div>
              <div class="font-display text-lg font-extrabold leading-none truncate">
                {{ user.displayName || user.email }}
              </div>
              <div class="text-[11px] uppercase tracking-wider text-sun-500 font-bold">
                Lvl {{ user.progress.level }} · {{ user.progress.rank }}
              </div>
            </div>
            <div class="text-right text-[10px] font-mono tabular-nums text-white/80">
              {{ user.progress.xp }} / {{ user.progress.nextLevelXp }} XP
            </div>
          </div>
          <div class="mt-2 h-2.5 w-full bg-brand-900/50 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full bg-sun-500 transition-all duration-500"
              :style="{ width: Math.round(user.progress.progress * 100) + '%' }"
            />
          </div>
        </div>
        <button
          type="button"
          class="text-xs text-white/70 underline underline-offset-2 hover:text-white"
          @click="logout"
        >
          Logout
        </button>
      </div>

      <div class="mt-3 inline-flex rounded-full bg-white border-2 border-brand-200 p-1 text-xs font-semibold">
        <button
          v-for="opt in (['distance', 'confidence', 'fresh', 'popular'] as const)"
          :key="opt"
          type="button"
          class="px-3 py-1.5 rounded-full transition-colors"
          :class="sortBy === opt ? 'bg-brand-500 text-white' : 'text-brand-900/70'"
          @click="sortBy = opt"
        >
          {{
            opt === 'distance' ? '📍 Nähe'
            : opt === 'confidence' ? '🔥 Heiß'
              : opt === 'fresh' ? '🆕 Frisch'
                : '⭐ Beliebt'
          }}
        </button>
      </div>
    </header>

    <section
      v-if="loading && spots.length === 0"
      class="flex-1 grid place-items-center text-center"
    >
      <div>
        <div class="text-5xl animate-wiggle">
          🍺
        </div>
        <p class="mt-2 text-brand-700 font-display">
          Lade Spots…
        </p>
      </div>
    </section>

    <section
      v-else-if="spots.length === 0"
      class="flex-1 grid place-items-center text-center"
    >
      <div class="max-w-xs">
        <div class="text-6xl">
          🕵️
        </div>
        <h2 class="font-display text-xl font-bold mt-3">
          Noch kein Mini-Bier erwischt
        </h2>
        <p class="text-sm text-brand-900/60 mt-2">
          Los! Beim nächsten Späti-Besuch: Wenn's da das kleine Heineken gibt, tipp auf 🍺 in der Bar unten.
        </p>
        <NuxtLink
          to="/add"
          class="btn-chunk mt-6 inline-flex h-12 px-6 bg-brand-500 text-white font-display font-bold"
        >
          Ersten Spot hinzufügen
        </NuxtLink>
      </div>
    </section>

    <section
      v-else
      class="flex-1 flex flex-col gap-3 mt-3"
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
