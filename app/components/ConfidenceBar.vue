<script setup lang="ts">
import type { Confidence } from '~~/shared/utils/confidence'

const props = defineProps<{
  confidence: Confidence
  confirmCount: number
  notFoundCount: number
}>()

const tierColor = computed(() => {
  switch (props.confidence.tier) {
    case 'hot': return 'bg-forest-500'
    case 'likely': return 'bg-forest-400'
    case 'uncertain': return 'bg-malt-400'
    case 'cold': return 'bg-rust-500'
    default: return 'bg-forest-300'
  }
})

const tierLabel = computed(() => {
  switch (props.confidence.tier) {
    case 'hot': return 'Sehr wahrscheinlich'
    case 'likely': return 'Wahrscheinlich'
    case 'uncertain': return 'Unsicher'
    case 'cold': return 'Eher nicht'
    default: return props.confidence.label
  }
})
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between gap-2">
      <div class="flex items-center gap-2 text-xs text-ink-700 font-medium">
        <span
          class="size-1.5 rounded-full"
          :class="tierColor"
          aria-hidden="true"
        />
        <span>{{ tierLabel }}</span>
      </div>
      <div
        class="font-mono text-[11px] text-ink-500 tabular-nums"
        :title="`${props.confirmCount} Bestätigungen, ${props.notFoundCount} negative Reports`"
      >
        {{ props.confidence.percent }}%
      </div>
    </div>
    <div class="mt-1.5 h-1 w-full rounded-full bg-forest-100 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700"
        :class="tierColor"
        :style="{ width: props.confidence.percent + '%' }"
      />
    </div>
  </div>
</template>
