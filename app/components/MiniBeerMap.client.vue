<script setup lang="ts">
import type * as L from 'leaflet'
import type { Spot } from '~~/shared/types/spot'

const props = defineProps<{
  spots: Spot[]
  me: { lat: number, lon: number } | null
  center?: { lat: number, lon: number } | null
}>()

const emit = defineEmits<{
  select: [spotId: string]
}>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let markers: L.Marker[] = []
let meMarker: L.CircleMarker | null = null
let LeafletLib: typeof L | null = null

onMounted(async () => {
  const mod = await import('leaflet')
  LeafletLib = mod
  if (!mapEl.value) return

  const startLat = props.center?.lat ?? props.me?.lat ?? 52.52
  const startLon = props.center?.lon ?? props.me?.lon ?? 13.405

  map = mod.map(mapEl.value, {
    center: [startLat, startLon],
    zoom: 14,
    zoomControl: false,
    attributionControl: true,
  })

  mod.control.zoom({ position: 'bottomright' }).addTo(map)

  mod.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(map)

  renderMarkers()
  renderMe()
})

watch(() => props.spots, () => renderMarkers(), { deep: true })
watch(() => props.me, () => renderMe())
watch(() => props.center, (c) => {
  if (map && c) map.flyTo([c.lat, c.lon], 16, { duration: 0.8 })
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  markers = []
  meMarker = null
})

function spotIcon(spot: Spot): L.DivIcon {
  if (!LeafletLib) throw new Error('Leaflet not loaded')
  const tone = tierTone(spot)
  const count = spot.confirmCount
  return LeafletLib.divIcon({
    className: 'mini-beer-marker',
    html: `
      <div style="position:relative;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;">
        <div style="
          width:34px;height:34px;border-radius:50%;
          background:${tone.bg};border:3px solid #FDFBF4;
          display:flex;align-items:center;justify-content:center;
          font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#FDFBF4;
        ">
          ${count}
        </div>
        <div style="width:2px;height:8px;background:${tone.bg};margin-top:-1px;"></div>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [0, 0],
  })
}

function tierTone(spot: Spot): { bg: string } {
  switch (spot.confidence.tier) {
    case 'hot': return { bg: '#1E5D3F' }
    case 'likely': return { bg: '#549573' }
    case 'uncertain': return { bg: '#A67B3E' }
    case 'cold': return { bg: '#B94A3B' }
    default: return { bg: '#85B598' }
  }
}

function renderMarkers(): void {
  if (!map || !LeafletLib) return
  markers.forEach(m => m.remove())
  markers = []
  for (const s of props.spots) {
    const marker = LeafletLib.marker([s.lat, s.lon], { icon: spotIcon(s) })
      .addTo(map)
      .bindTooltip(
        `<strong>${escapeHtml(s.name)}</strong><br><span style="opacity:0.7;">${escapeHtml(s.address)}</span>`,
        { direction: 'top', offset: [0, -42] },
      )
    marker.on('click', () => emit('select', s.id))
    markers.push(marker)
  }
}

function renderMe(): void {
  if (!map || !LeafletLib) return
  meMarker?.remove()
  if (!props.me) return
  meMarker = LeafletLib.circleMarker([props.me.lat, props.me.lon], {
    radius: 7,
    color: '#FDFBF4',
    fillColor: '#1E5D3F',
    fillOpacity: 1,
    weight: 3,
  }).addTo(map).bindTooltip('Du bist hier', { direction: 'top' })
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c]!))
}

defineExpose({
  flyTo(lat: number, lon: number, zoom = 17) {
    map?.flyTo([lat, lon], zoom, { duration: 0.8 })
  },
})
</script>

<template>
  <div
    ref="mapEl"
    class="absolute inset-0"
  />
</template>
