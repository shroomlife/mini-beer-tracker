<script setup lang="ts">
const { toasts } = useXpFeedback()

const reasonLabel: Record<'created' | 'confirmed' | 'not_found', string> = {
  created: 'Neuer Spot entdeckt',
  confirmed: 'Bestätigt',
  not_found: 'Danke für den Hinweis',
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-6 inset-x-0 z-[8000] pointer-events-none flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="xp">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-none inline-flex items-center gap-3 rounded-full bg-ink-900 text-cream-50 px-5 py-3 border border-ink-800"
          style="box-shadow: 0 12px 30px -6px rgba(11, 22, 20, 0.4);"
        >
          <span class="text-sm font-medium">{{ reasonLabel[t.reason] }}</span>
          <span class="inline-flex items-center gap-1 font-display text-base font-semibold text-malt-400 tabular-nums">
            +{{ t.gained }}
            <span class="text-[10px] uppercase tracking-widest text-malt-400/70 font-sans">xp</span>
          </span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.xp-enter-active,
.xp-leave-active {
  transition: transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.45s;
}
.xp-enter-from {
  transform: translateY(-16px) scale(0.96);
  opacity: 0;
}
.xp-leave-to {
  transform: translateY(-40px) scale(0.98);
  opacity: 0;
}
</style>
