<script setup lang="ts">
const props = defineProps<{
  active: boolean
  pieces: Array<{ id: number, emoji: string, x: number, delay: number, duration: number, drift: number, rotate: number }>
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.active"
      class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <span
        v-for="p in props.pieces"
        :key="p.id"
        class="absolute text-xl will-change-transform opacity-80"
        :style="{
          left: p.x + '%',
          top: '-40px',
          animation: `fall-${p.id} ${p.duration}ms cubic-bezier(0.3, 0.1, 0.3, 1) ${p.delay}ms forwards`,
        }"
      >{{ p.emoji }}</span>
      <component :is="'style'">
        {{ props.pieces.map(p =>
          `@keyframes fall-${p.id} {
            0%   { transform: translate(0,0) rotate(0deg); opacity: 0.9; }
            100% { transform: translate(${p.drift}px, 110vh) rotate(${p.rotate}deg); opacity: 0; }
          }`).join('\n')
        }}
      </component>
    </div>
  </Teleport>
</template>
