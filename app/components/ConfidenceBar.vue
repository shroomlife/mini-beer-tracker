<script setup lang="ts">
import type { Confidence } from '~~/shared/utils/confidence'

const props = defineProps<{
  confidence: Confidence
  confirmCount: number
  notFoundCount: number
}>()

const tierColor = computed(() => {
  switch (props.confidence.tier) {
    case 'hot': return 'bg-emerald-500'
    case 'likely': return 'bg-lime-500'
    case 'uncertain': return 'bg-amber-500'
    case 'cold': return 'bg-rose-500'
    default: return 'bg-brand-400'
  }
})

const tierBg = computed(() => {
  switch (props.confidence.tier) {
    case 'hot': return 'bg-emerald-50 text-emerald-800 border-emerald-300'
    case 'likely': return 'bg-lime-50 text-lime-800 border-lime-300'
    case 'uncertain': return 'bg-amber-50 text-amber-800 border-amber-300'
    case 'cold': return 'bg-rose-50 text-rose-800 border-rose-300'
    default: return 'bg-brand-50 text-brand-800 border-brand-300'
  }
})
</script>

<template>
  <div>
    <div
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold"
      :class="tierBg"
      :title="`${confirmCount}× bestätigt, ${notFoundCount}× nicht gefunden`"
    >
      <span>{{ confidence.emoji }}</span>
      <span>{{ confidence.label }}</span>
      <span class="tabular-nums opacity-70">· {{ confidence.percent }}%</span>
    </div>
    <div
      class="mt-1.5 h-1.5 w-full rounded-full bg-brand-100 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="tierColor"
        :style="{ width: confidence.percent + '%' }"
      />
    </div>
  </div>
</template>
