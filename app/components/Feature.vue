<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  body: string
}>()
</script>

<template>
  <div>
    <div class="size-10 rounded-xl bg-forest-50 border border-forest-100 grid place-items-center">
      <Icon
        :name="icon"
        class="size-5 text-forest-700"
      />
    </div>
    <h3 class="mt-4 font-display text-lg font-semibold text-ink-900">
      {{ title }}
    </h3>
    <p class="mt-1.5 text-sm leading-relaxed text-ink-700">
      {{ body }}
    </p>
  </div>
</template>
