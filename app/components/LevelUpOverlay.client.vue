<script setup lang="ts">
import { rankTitle } from '~~/shared/utils/xp'

const { levelUp, dismissLevelUp } = useXpFeedback()

const level = computed(() => levelUp.value?.newLevel ?? 0)
const title = computed(() => rankTitle(level.value))
</script>

<template>
  <Teleport to="body">
    <Transition name="lu">
      <div
        v-if="levelUp"
        class="fixed inset-0 z-[9500] grid place-items-center bg-ink-900/60 backdrop-blur-md px-5"
        role="alertdialog"
        aria-modal="true"
        @click="dismissLevelUp"
      >
        <div
          class="max-w-sm w-full bg-cream-50 rounded-[2rem] px-8 py-10 text-center animate-pop"
          style="box-shadow: 0 30px 60px -20px rgba(11, 22, 20, 0.5);"
          @click.stop
        >
          <div class="text-[10px] uppercase tracking-[0.32em] font-medium text-malt-500">
            Aufgestiegen
          </div>

          <div class="mt-4 flex items-center justify-center gap-3">
            <div class="h-px w-10 bg-forest-200" />
            <div class="font-display text-5xl font-semibold text-forest-700 tabular-nums">
              {{ level }}
            </div>
            <div class="h-px w-10 bg-forest-200" />
          </div>
          <div class="text-[10px] uppercase tracking-widest text-ink-500 mt-1">
            Level
          </div>

          <h2 class="mt-6 font-display text-2xl font-semibold text-ink-900 leading-tight">
            {{ title }}
          </h2>
          <p class="mt-3 text-sm text-ink-700 leading-relaxed">
            Dein neuer Titel. Die Berliner Mini-Bier-Welt hat dich gerade etwas lieber.
          </p>

          <button
            type="button"
            class="btn-primary mt-8 h-11 px-8 text-sm"
            @click="dismissLevelUp"
          >
            Weiter
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lu-enter-active, .lu-leave-active { transition: opacity 0.3s; }
.lu-enter-from, .lu-leave-to { opacity: 0; }
</style>
