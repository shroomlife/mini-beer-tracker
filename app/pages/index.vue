<script setup lang="ts">
import type { Spot } from '~~/shared/types/spot'

useHead({ title: 'Mini Beer Tracker — Map' })

const { spots, refresh, confirm: confirmSpot, notFound: notFoundSpot, remove: removeSpot } = useSpots()
const { coords, loading: locLoading, error: locError, locate } = useCurrentLocation()

const selectedId = ref<string | null>(null)
const selected = computed<Spot | null>(() =>
  spots.value.find(s => s.id === selectedId.value) ?? null,
)

const mapRef = ref<{ flyTo: (lat: number, lon: number, z?: number) => void } | null>(null)
const manualCenter = ref<{ lat: number, lon: number } | null>(null)

onMounted(async () => {
  await refresh()
  // Soft ask for location in background — wenn denied, still funktional
  locate().catch(() => { /* silent */ })
})

watch(coords, (c) => {
  if (c) {
    manualCenter.value = { lat: c.lat, lon: c.lon }
    refresh({ lat: c.lat, lon: c.lon })
  }
})

function selectSpot(id: string): void {
  selectedId.value = id
  const s = spots.value.find(x => x.id === id)
  if (s) mapRef.value?.flyTo(s.lat, s.lon, 17)
}

async function recenter(): Promise<void> {
  try {
    const c = await locate()
    mapRef.value?.flyTo(c.lat, c.lon, 16)
  }
  catch { /* error surfaced via locError */ }
}
</script>

<template>
  <main class="relative flex-1 flex flex-col">
    <!-- Map layer — bottom-36 (144px) gibt genug Clearance unter der FAB,
         die von der Bottom-Bar nach oben rausragt -->
    <div class="absolute inset-0 bottom-36">
      <ClientOnly>
        <MiniBeerMap
          ref="mapRef"
          :spots="spots"
          :me="coords"
          :center="manualCenter"
          @select="selectSpot"
        />
        <template #fallback>
          <div class="size-full grid place-items-center bg-brand-50">
            <div class="text-center">
              <div class="text-5xl animate-wiggle">
                🗺️
              </div>
              <p class="mt-3 font-display text-brand-700">
                Karte wird geladen …
              </p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Top card -->
    <header class="relative z-10 safe-top px-4">
      <div class="mx-auto max-w-md rounded-3xl bg-white/90 backdrop-blur border-2 border-brand-200 px-4 py-3 shadow-lg">
        <div class="flex items-center gap-3">
          <div class="text-3xl animate-wiggle">
            🍺🤏
          </div>
          <div class="flex-1">
            <h1 class="font-display font-bold text-xl leading-none">
              Mini Beer Tracker
            </h1>
            <p class="text-xs text-brand-900/60 mt-0.5">
              {{ spots.length }} Spot{{ spots.length === 1 ? '' : 's' }} auf der Karte · Berlin-Modus
            </p>
          </div>
          <button
            type="button"
            :disabled="locLoading"
            class="btn-chunk size-11 rounded-2xl bg-brand-500 text-white disabled:opacity-60"
            aria-label="Auf meinen Standort zentrieren"
            @click="recenter"
          >
            <Icon
              :name="locLoading ? 'mdi:loading' : 'mdi:crosshairs-gps'"
              class="size-5"
              :class="{ 'animate-spin': locLoading }"
            />
          </button>
        </div>
        <p
          v-if="locError"
          class="mt-2 text-xs text-pop-500 font-medium"
        >
          {{ locError }}
        </p>
      </div>
    </header>

    <!-- Selected spot peek sheet -->
    <Transition name="peek">
      <div
        v-if="selected"
        class="absolute left-0 right-0 bottom-36 z-20 px-4"
      >
        <div class="mx-auto max-w-md animate-pop">
          <SpotCard
            :spot="selected"
            @confirm="confirmSpot"
            @not-found="notFoundSpot"
            @remove="async (id) => { await removeSpot(id); selectedId = null }"
          />
          <button
            type="button"
            class="mt-2 text-xs text-brand-700/70 underline mx-auto block"
            @click="selectedId = null"
          >
            Schließen
          </button>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.peek-enter-active, .peek-leave-active { transition: all 0.25s ease; }
.peek-enter-from, .peek-leave-to { transform: translateY(20px); opacity: 0; }
</style>
