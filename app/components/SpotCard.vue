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
  if (days < 1) return 'Heute bestätigt'
  if (days < 2) return 'Gestern bestätigt'
  if (days < 14) return `Vor ${Math.round(days)} Tagen`
  if (days < 60) return `Vor ${Math.round(days / 7)} Wochen`
  return `Vor ${Math.round(days / 30)} Monaten`
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
  <article class="card p-5">
    <!-- Header: Name + Distance -->
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h3 class="font-display text-lg font-semibold leading-tight text-ink-900 truncate">
          {{ props.spot.name }}
        </h3>
        <p class="mt-0.5 text-sm text-ink-500 leading-snug line-clamp-2">
          {{ props.spot.address }}
        </p>
      </div>
      <div
        v-if="distance"
        class="shrink-0 text-right"
      >
        <div class="font-display text-base font-semibold text-forest-700 tabular-nums">
          {{ distance }}
        </div>
      </div>
    </div>

    <!-- Confidence Bar -->
    <div class="mt-4">
      <ConfidenceBar
        :confidence="props.spot.confidence"
        :confirm-count="props.spot.confirmCount"
        :not-found-count="props.spot.notFoundCount"
      />
    </div>

    <!-- Meta row: timestamp, confirms, price, vibe -->
    <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-700">
      <span class="inline-flex items-center gap-1.5">
        <Icon
          name="ph:clock-countdown-bold"
          class="size-3.5 text-ink-500"
        />
        {{ freshness }}
      </span>
      <span class="text-ink-300">·</span>
      <span class="inline-flex items-center gap-1.5">
        <Icon
          name="ph:check-circle-bold"
          class="size-3.5 text-forest-500"
        />
        {{ props.spot.confirmCount }}× bestätigt
      </span>
      <template v-if="props.spot.notFoundCount > 0">
        <span class="text-ink-300">·</span>
        <span class="inline-flex items-center gap-1.5">
          <Icon
            name="ph:x-circle-bold"
            class="size-3.5 text-rust-500"
          />
          {{ props.spot.notFoundCount }}× negativ
        </span>
      </template>
      <template v-if="priceEuros">
        <span class="text-ink-300">·</span>
        <span class="inline-flex items-center gap-1.5 font-medium text-malt-600">
          {{ priceEuros }} €
        </span>
      </template>
    </div>

    <!-- Vibe quote -->
    <p
      v-if="props.spot.vibe"
      class="mt-3 pl-3 border-l-2 border-forest-200 text-sm italic text-ink-700 leading-relaxed"
    >
      {{ props.spot.vibe }}
    </p>

    <!-- Actions -->
    <div class="mt-5 flex flex-wrap gap-2">
      <a
        :href="mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary h-10 px-4 text-sm gap-2"
      >
        <Icon
          name="ph:navigation-arrow-bold"
          class="size-4"
        />
        Navigation
      </a>
      <button
        type="button"
        class="btn-secondary h-10 px-4 text-sm gap-2"
        @click="emit('confirm', props.spot.id)"
      >
        <Icon
          name="ph:check-bold"
          class="size-4"
        />
        Bestätigen
      </button>
      <button
        type="button"
        class="btn-secondary h-10 px-4 text-sm gap-2 text-rust-600 border-rust-500/30 hover:bg-rust-500/5 hover:border-rust-500/50"
        @click="emit('notFound', props.spot.id)"
      >
        <Icon
          name="ph:x-bold"
          class="size-4"
        />
        Nicht da
      </button>
      <button
        type="button"
        aria-label="Spot löschen"
        class="btn-ghost h-10 px-3 text-sm ml-auto"
        @click="emit('remove', props.spot.id)"
      >
        <Icon
          name="ph:trash-bold"
          class="size-4"
        />
      </button>
    </div>
  </article>
</template>
