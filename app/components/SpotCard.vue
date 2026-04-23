<script setup lang="ts">
import type { Spot } from '~~/shared/types/spot'

const props = defineProps<{
  spot: Spot
}>()

const emit = defineEmits<{
  confirm: [id: string]
  notFound: [id: string]
  remove: [id: string]
}>()

const priceEuros = computed(() => {
  const p = props.spot.priceCents
  if (p == null) return null
  return (p / 100).toFixed(2).replace('.', ',')
})

const freshness = computed(() => {
  const d = new Date(props.spot.confirmedAt)
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
  if (days < 1) return { label: 'heute bestätigt', tone: 'fresh' as const }
  if (days < 7) return { label: `vor ${Math.round(days)} Tagen`, tone: 'ok' as const }
  if (days < 30) return { label: `vor ${Math.round(days / 7)} Wochen`, tone: 'old' as const }
  return { label: `vor ${Math.round(days / 30)} Monaten`, tone: 'stale' as const }
})

const mapsUrl = computed(() =>
  `https://www.google.com/maps/search/?api=1&query=${props.spot.lat},${props.spot.lon}`,
)

const distance = computed(() => {
  const d = props.spot.distanceKm
  if (d == null) return null
  if (d < 1) return `${Math.round(d * 1000)} m`
  return `${d.toFixed(1)} km`
})
</script>

<template>
  <article
    class="relative bg-white rounded-3xl border-2 border-brand-200/60 p-4 shadow-[0_4px_0_0_#C8EBD6] hover:shadow-[0_6px_0_0_#93D7AE] transition-all"
  >
    <div class="flex items-start gap-3">
      <div class="grid place-items-center size-12 rounded-2xl bg-brand-500 text-white text-2xl shrink-0">
        🍺
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-display font-bold text-lg leading-tight truncate">
          {{ props.spot.name }}
        </h3>
        <p class="text-sm text-brand-900/70 leading-snug line-clamp-2">
          {{ props.spot.address }}
        </p>

        <div class="mt-2">
          <ConfidenceBar
            :confidence="props.spot.confidence"
            :confirm-count="props.spot.confirmCount"
            :not-found-count="props.spot.notFoundCount"
          />
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
          <span
            v-if="distance"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200"
          >
            <Icon
              name="mdi:walk"
              class="size-3.5"
            />
            {{ distance }}
          </span>
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
            :class="{
              'bg-emerald-50 text-emerald-700 border-emerald-200': freshness.tone === 'fresh',
              'bg-lime-50 text-lime-700 border-lime-200': freshness.tone === 'ok',
              'bg-amber-50 text-amber-700 border-amber-200': freshness.tone === 'old',
              'bg-rose-50 text-rose-700 border-rose-200': freshness.tone === 'stale',
            }"
          >
            <Icon
              name="mdi:clock-outline"
              class="size-3.5"
            />
            {{ freshness.label }}
          </span>
          <span
            v-if="props.spot.confirmCount > 1"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pop-500/10 text-pop-500 border border-pop-500/30"
          >
            <Icon
              name="mdi:fire"
              class="size-3.5"
            />
            {{ props.spot.confirmCount }}× bestätigt
          </span>
          <span
            v-if="props.spot.notFoundCount > 0"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
          >
            🕵️ {{ props.spot.notFoundCount }}× leer
          </span>
          <span
            v-if="priceEuros"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sun-500/20 text-amber-800 border border-sun-500/60"
          >
            💶 {{ priceEuros }} €
          </span>
        </div>

        <p
          v-if="props.spot.vibe"
          class="mt-2 text-[12px] text-brand-900/80 italic"
        >
          „{{ props.spot.vibe }}"
        </p>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-2">
      <a
        :href="mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-chunk h-10 bg-brand-500 text-white text-sm hover:bg-brand-600 col-span-2"
      >
        <Icon
          name="mdi:google-maps"
          class="size-4 mr-1.5"
        />
        In Google Maps öffnen
      </a>
      <button
        type="button"
        class="btn-chunk h-10 px-3 bg-brand-50 text-brand-800 border border-brand-300 text-sm font-semibold"
        @click="emit('confirm', props.spot.id)"
      >
        <Icon
          name="mdi:hand-clap"
          class="size-4 mr-1"
        />
        Noch da!
      </button>
      <button
        type="button"
        class="btn-chunk h-10 px-3 bg-rose-50 text-rose-800 border border-rose-300 text-sm font-semibold"
        @click="emit('notFound', props.spot.id)"
      >
        🕵️ War nicht da
      </button>
      <button
        type="button"
        aria-label="Löschen"
        class="btn-chunk h-9 px-3 bg-white border border-brand-200 text-brand-900/50 text-xs col-span-2"
        @click="emit('remove', props.spot.id)"
      >
        <Icon
          name="mdi:trash-can-outline"
          class="size-4 mr-1"
        />
        Spot löschen
      </button>
    </div>
  </article>
</template>
