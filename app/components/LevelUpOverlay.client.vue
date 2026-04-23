<script setup lang="ts">
import { rankEmoji, rankTitle } from '~~/shared/utils/xp'

const { levelUp, dismissLevelUp } = useXpFeedback()

const level = computed(() => levelUp.value?.newLevel ?? 0)
const emoji = computed(() => rankEmoji(level.value))
const title = computed(() => rankTitle(level.value))
</script>

<template>
  <Teleport to="body">
    <Transition name="levelup">
      <div
        v-if="levelUp"
        class="fixed inset-0 z-[9500] grid place-items-center bg-brand-900/70 backdrop-blur-sm"
        role="alertdialog"
        aria-modal="true"
        @click="dismissLevelUp"
      >
        <div
          class="max-w-sm w-[calc(100%-2rem)] bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-[32px] p-8 text-center border-4 border-sun-500 shadow-2xl animate-pop"
          @click.stop
        >
          <div class="text-xs uppercase tracking-[0.3em] font-display font-bold text-sun-500">
            Level Up
          </div>
          <div class="mt-2 text-7xl animate-wiggle">
            {{ emoji }}
          </div>
          <h2 class="mt-3 font-display text-3xl font-extrabold leading-tight">
            Level {{ level }}
          </h2>
          <p class="font-display text-lg text-sun-500">
            {{ title }}
          </p>
          <p class="mt-4 text-sm text-white/80">
            Du bist jetzt ein <strong>{{ title }}</strong>.
            Die Berliner Mini-Bier-Welt bewundert dich. 💚
          </p>
          <button
            type="button"
            class="btn-chunk mt-6 h-12 px-6 bg-sun-500 text-brand-900 font-display font-bold"
            @click="dismissLevelUp"
          >
            Prost! 🍻
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.levelup-enter-active, .levelup-leave-active { transition: opacity 0.35s; }
.levelup-enter-from, .levelup-leave-to { opacity: 0; }
</style>
