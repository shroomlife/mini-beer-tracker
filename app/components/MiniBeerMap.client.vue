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

  // Default Berlin-Mitte falls keine Koords
  const startLat = props.center?.lat ?? props.me?.lat ?? 52.52
  const startLon = props.center?.lon ?? props.me?.lon ?? 13.405

  map = mod.map(mapEl.value, {
    center: [startLat, startLon],
    zoom: 14,
    zoomControl: false,
    attributionControl: true,
  })

  mod.control.zoom({ position: 'topright' }).addTo(map)

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

function beerIcon(spot: Spot): L.DivIcon {
  if (!LeafletLib) throw new Error('Leaflet not loaded')
  const count = Math.min(spot.confirmCount, 9)
  const badge = count > 1 ? `<span style="position:absolute;top:-6px;right:-6px;background:#FF3E3E;color:#fff;border-radius:999px;font-size:10px;font-weight:700;padding:2px 5px;line-height:1;border:2px solid #fff;">${count}</span>` : ''
  return LeafletLib.divIcon({
    className: 'mini-beer-marker',
    html: `
      <div style="position:relative;transform:translate(-50%,-100%);">
        <div style="font-size:36px;line-height:1;">🍺</div>
        ${badge}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [0, 0],
  })
}

function renderMarkers(): void {
  if (!map || !LeafletLib) return
  markers.forEach(m => m.remove())
  markers = []
  for (const s of props.spots) {
    const marker = LeafletLib.marker([s.lat, s.lon], { icon: beerIcon(s) })
      .addTo(map)
      .bindTooltip(`<strong>${escapeHtml(s.name)}</strong><br><span style="opacity:.7">${escapeHtml(s.address)}</span>`, {
        direction: 'top',
        offset: [0, -38],
      })
    marker.on('click', () => emit('select', s.id))
    markers.push(marker)
  }
}

function renderMe(): void {
  if (!map || !LeafletLib) return
  meMarker?.remove()
  if (!props.me) return
  meMarker = LeafletLib.circleMarker([props.me.lat, props.me.lon], {
    radius: 8,
    color: '#006B3F',
    fillColor: '#2FA065',
    fillOpacity: 0.95,
    weight: 3,
  }).addTo(map).bindTooltip('Du bist hier 📍', { direction: 'top' })
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
