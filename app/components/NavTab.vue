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
    class="flex flex-col items-center gap-1 px-4 py-1.5 rounded-full transition-colors duration-200"
    :class="active ? 'text-forest-700' : 'text-ink-500 hover:text-forest-600'"
  >
    <Icon
      :name="icon"
      class="size-5 transition-transform duration-200"
      :class="active ? 'scale-110' : ''"
    />
    <span class="text-[11px] font-medium">{{ label }}</span>
  </NuxtLink>
</template>
