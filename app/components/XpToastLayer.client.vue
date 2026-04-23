<script setup lang="ts">
const { toasts } = useXpFeedback()

const reasonLabel: Record<'created' | 'confirmed' | 'not_found', string> = {
  created: 'Neuer Spot!',
  confirmed: 'Bestätigt!',
  not_found: 'Danke für den Hinweis!',
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-24 inset-x-0 z-[8000] pointer-events-none flex flex-col items-center gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="xp">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-none inline-flex items-center gap-2 rounded-full bg-brand-500 text-white font-display font-bold px-4 py-2 shadow-lg border-2 border-white"
        >
          <span class="text-xl">{{ t.emoji }}</span>
          <span class="text-sm">{{ reasonLabel[t.reason] }}</span>
          <span class="text-base font-extrabold text-sun-500">+{{ t.gained }} XP</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.xp-enter-active,
.xp-leave-active {
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2), opacity 0.5s;
}
.xp-enter-from {
  transform: translateY(30px) scale(0.8);
  opacity: 0;
}
.xp-leave-to {
  transform: translateY(-60px) scale(1.1);
  opacity: 0;
}
</style>
