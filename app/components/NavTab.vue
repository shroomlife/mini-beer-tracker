<script setup lang="ts">
defineProps<{
  to: string
  icon: string
  label: string
  active: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
    :class="active ? 'text-brand-600' : 'text-brand-900/50 hover:text-brand-600'"
  >
    <Icon
      :name="icon"
      class="size-6"
    />
    <span class="text-[10px] font-display font-semibold uppercase tracking-wide">{{ label }}</span>
  </NuxtLink>
</template>
