<script setup lang="ts">
// Inline SVG — keine white-bg-Letterboxes, saubere Aspect-Ratio auf allen Devices
withDefaults(defineProps<{
  size?: number | string
  class?: string
}>(), {
  size: 48,
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 96 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="$props.class"
    role="img"
    aria-label="Mini Beer Tracker"
  >
    <!-- Cap (malt) with subtle tilt for playfulness -->
    <g transform="translate(48 14) rotate(-6)">
      <rect
        x="-13"
        y="-7"
        width="26"
        height="14"
        rx="3"
        fill="#C89D5F"
      />
      <rect
        x="-13"
        y="-7"
        width="26"
        height="3"
        rx="1.5"
        fill="#A67B3E"
      />
    </g>
    <!-- Bottle body -->
    <path
      d="M 35 22 L 35 40 Q 35 46 31 50 L 31 108 Q 31 118 41 118 L 55 118 Q 65 118 65 108 L 65 50 Q 61 46 61 40 L 61 22 Z"
      fill="#1E5D3F"
    />
    <!-- Neck highlight -->
    <rect
      x="38"
      y="28"
      width="3"
      height="16"
      rx="1.5"
      fill="#2F7A54"
    />
    <!-- Label -->
    <rect
      x="33"
      y="72"
      width="30"
      height="20"
      fill="#FDFBF4"
    />
    <circle
      cx="48"
      cy="82"
      r="2"
      fill="#C89D5F"
    />
  </svg>
</template>
