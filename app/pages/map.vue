<script setup lang="ts">
import type { Spot } from '~~/shared/types/spot'

useSeoMeta({
  title: 'Karte — Mini Beer Tracker',
  robots: 'noindex,nofollow',
})

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
  catch { /* surfaced via locError */ }
}
</script>

<template>
  <main class="relative flex-1 flex flex-col">
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
          <div class="size-full grid place-items-center bg-forest-50">
            <div class="text-sm text-ink-500">
              Karte wird geladen…
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Top card -->
    <header class="relative z-10 safe-top px-4 md:px-6">
      <div
        class="mx-auto max-w-md card px-4 py-3 flex items-center gap-3"
        style="backdrop-filter: blur(12px);"
      >
        <LogoMark :size="32" />
        <div class="flex-1 min-w-0">
          <div class="font-display text-lg font-bold tracking-tight text-ink-900 leading-tight">
            Karte
          </div>
          <p class="text-xs text-ink-500">
            {{ spots.length }} Spot{{ spots.length === 1 ? '' : 's' }}
          </p>
        </div>
        <button
          type="button"
          :disabled="locLoading"
          class="btn-secondary size-10 disabled:opacity-50"
          aria-label="Auf meinen Standort zentrieren"
          @click="recenter"
        >
          <Icon
            :name="locLoading ? 'ph:circle-notch-bold' : 'ph:crosshair-bold'"
            class="size-4"
            :class="{ 'animate-spin': locLoading }"
          />
        </button>
      </div>
      <p
        v-if="locError"
        class="mt-2 mx-auto max-w-md text-xs text-rust-600 px-2"
      >
        {{ locError }}
      </p>
    </header>

    <Transition name="peek">
      <div
        v-if="selected"
        class="absolute left-0 right-0 bottom-36 z-20 px-4"
      >
        <div class="mx-auto max-w-md animate-rise">
          <SpotCard
            :spot="selected"
            @confirm="confirmSpot"
            @not-found="notFoundSpot"
            @remove="async (id) => { await removeSpot(id); selectedId = null }"
          />
          <button
            type="button"
            class="mt-2 text-xs text-ink-500 underline underline-offset-4 mx-auto block hover:text-forest-700"
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
.peek-enter-active, .peek-leave-active {
  transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.3s;
}
.peek-enter-from, .peek-leave-to {
  transform: translateY(16px);
  opacity: 0;
}
</style>
