<script setup lang="ts">
import type { GeocodeResult } from '~~/shared/types/spot'

useHead({ title: 'Mini Beer entdeckt!' })

type Step = 'intro' | 'locating' | 'confirm' | 'saved'
const step = ref<Step>('intro')

const { coords, loading: locLoading, error: locError, locate } = useCurrentLocation()
const { add } = useSpots()
const { active: confettiActive, pieces: confettiPieces, celebrate } = useConfetti()

const geo = ref<GeocodeResult | null>(null)
const geoError = ref<string | null>(null)
const geoLoading = ref(false)

const form = reactive({
  name: '',
  priceEuros: '',
  vibe: '',
})

const router = useRouter()

async function startCapture(): Promise<void> {
  step.value = 'locating'
  try {
    const c = await locate()
    geoLoading.value = true
    geoError.value = null
    try {
      geo.value = await $fetch<GeocodeResult>('/api/geocode', {
        query: { lat: String(c.lat), lon: String(c.lon) },
      })
      const suggestedName = [geo.value.road, geo.value.houseNumber].filter(Boolean).join(' ')
        || geo.value.suburb
        || 'Später'
      form.name = suggestedName + (geo.value.suburb && suggestedName !== geo.value.suburb ? ` (${geo.value.suburb})` : '')
    }
    catch (e) {
      geoError.value = e instanceof Error ? e.message : 'Adresse konnte nicht geladen werden'
    }
    finally {
      geoLoading.value = false
    }
    step.value = 'confirm'
  }
  catch {
    step.value = 'intro'
  }
}

const addressPretty = computed(() => {
  if (!geo.value) return ''
  const a = geo.value
  const line1 = [a.road, a.houseNumber].filter(Boolean).join(' ')
  const line2 = [a.postcode, a.city].filter(Boolean).join(' ')
  return [line1, line2].filter(Boolean).join(', ')
})

const lastResult = ref<{ gained: number, reason: string } | null>(null)

async function save(): Promise<void> {
  if (!coords.value || !geo.value) return
  const priceCents = form.priceEuros
    ? Math.round(Number(form.priceEuros.replace(',', '.')) * 100)
    : null
  const res = await add({
    name: form.name.trim() || 'Später',
    address: addressPretty.value || geo.value.displayName,
    lat: coords.value.lat,
    lon: coords.value.lon,
    accuracyM: Math.round(coords.value.accuracy),
    priceCents: Number.isFinite(priceCents) ? priceCents : null,
    vibe: form.vibe.trim() || null,
  })
  lastResult.value = { gained: res.xp.gained, reason: res.xp.reason }
  step.value = 'saved'
  celebrate()
  setTimeout(() => {
    router.push('/spots')
  }, 2200)
}
</script>

<template>
  <main class="relative flex-1 flex flex-col safe-top px-5 pb-28">
    <ConfettiLayer
      :active="confettiActive"
      :pieces="confettiPieces"
    />

    <!-- Intro Step -->
    <section
      v-if="step === 'intro'"
      class="flex-1 flex flex-col items-center justify-center text-center gap-6"
    >
      <div class="text-7xl animate-wiggle">
        🍺🤏
      </div>
      <h1 class="font-display text-3xl font-bold leading-tight">
        Du hast Mini-Bier entdeckt?
      </h1>
      <p class="text-brand-900/70 max-w-sm">
        Drück einmal auf den Button, wir speichern deinen Standort präzise
        und merken uns den Späti für dich und deine Frau. 💚
      </p>

      <button
        type="button"
        class="btn-chunk relative h-32 w-full max-w-sm rounded-[32px] bg-pop-500 text-white border-4 border-white shadow-[0_10px_0_0_#9a0000] active:shadow-[0_4px_0_0_#9a0000] hover:bg-pop-500"
        @click="startCapture"
      >
        <span class="absolute -top-6 -left-4 text-5xl rotate-[-15deg] animate-wiggle">🍺</span>
        <span class="absolute -bottom-4 -right-4 text-4xl rotate-[20deg]">✨</span>
        <span class="font-display text-2xl font-extrabold tracking-tight leading-tight">
          HIER GIBTS<br>MINI BIER!
        </span>
      </button>

      <p
        v-if="locError"
        class="text-pop-500 text-sm font-medium"
      >
        {{ locError }}
      </p>

      <p class="text-xs text-brand-900/50 max-w-xs">
        Wir brauchen kurz deinen Standort (geht natürlich nur auf dieses Gerät) —
        die Adresse wird via OpenStreetMap geholt.
      </p>
    </section>

    <!-- Locating Step -->
    <section
      v-else-if="step === 'locating'"
      class="flex-1 flex flex-col items-center justify-center text-center gap-5"
    >
      <div class="text-7xl">
        <span
          v-if="locLoading"
          class="inline-block animate-spin"
        >📡</span>
        <span
          v-else
          class="inline-block animate-wiggle"
        >🧭</span>
      </div>
      <h2 class="font-display text-2xl font-bold">
        Standort wird ermittelt…
      </h2>
      <p class="text-sm text-brand-900/60 max-w-sm">
        Bitte erlaube kurz den Standort-Zugriff, falls dein Browser fragt.
      </p>
    </section>

    <!-- Confirm Step -->
    <section
      v-else-if="step === 'confirm'"
      class="flex-1 flex flex-col gap-4"
    >
      <header class="pt-4">
        <button
          type="button"
          class="text-sm text-brand-700 underline"
          @click="step = 'intro'"
        >
          ← Nochmal messen
        </button>
        <h2 class="font-display text-2xl font-bold mt-2">
          Gefunden! 🎯
        </h2>
      </header>

      <div class="rounded-3xl bg-white border-2 border-brand-200 p-4">
        <div class="flex items-start gap-3">
          <div class="text-3xl">
            📍
          </div>
          <div class="flex-1 min-w-0">
            <p
              v-if="geoLoading"
              class="text-sm text-brand-900/50"
            >
              Adresse wird geholt…
            </p>
            <p
              v-else-if="geoError"
              class="text-sm text-pop-500"
            >
              {{ geoError }}
            </p>
            <div
              v-else-if="geo"
              class="text-sm"
            >
              <p class="font-semibold">
                {{ addressPretty || geo.displayName }}
              </p>
              <p
                v-if="geo.suburb"
                class="text-brand-900/60"
              >
                Kiez: {{ geo.suburb }}
              </p>
            </div>
            <p
              v-if="coords"
              class="text-[11px] text-brand-900/40 mt-1 font-mono"
            >
              {{ coords.lat.toFixed(5) }}, {{ coords.lon.toFixed(5) }} · ±{{ Math.round(coords.accuracy) }}m
            </p>
          </div>
        </div>
      </div>

      <form
        class="flex flex-col gap-3"
        @submit.prevent="save"
      >
        <label class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-brand-900/80">Name des Spätis</span>
          <input
            v-model="form.name"
            type="text"
            placeholder="z. B. Späti an der Ecke"
            class="rounded-2xl border-2 border-brand-200 px-4 py-3 bg-white focus:border-brand-500 outline-none"
            required
          >
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-brand-900/80">Preis pro Mini-Bier <span class="text-brand-900/40 font-normal">(optional)</span></span>
          <div class="relative">
            <input
              v-model="form.priceEuros"
              type="text"
              inputmode="decimal"
              placeholder="1,50"
              class="w-full rounded-2xl border-2 border-brand-200 px-4 py-3 pr-10 bg-white focus:border-brand-500 outline-none"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-900/50">€</span>
          </div>
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-brand-900/80">Vibe / Notiz <span class="text-brand-900/40 font-normal">(optional)</span></span>
          <textarea
            v-model="form.vibe"
            rows="2"
            placeholder="Freundlich, hat auch Kühlschrank…"
            class="rounded-2xl border-2 border-brand-200 px-4 py-3 bg-white focus:border-brand-500 outline-none resize-none"
          />
        </label>

        <button
          type="submit"
          :disabled="!geo || !coords"
          class="btn-chunk h-14 bg-brand-500 text-white font-display text-lg font-bold disabled:opacity-50 disabled:shadow-none"
        >
          🍺 Spot speichern
        </button>
      </form>
    </section>

    <!-- Saved Step -->
    <section
      v-else-if="step === 'saved'"
      class="flex-1 flex flex-col items-center justify-center text-center gap-5"
    >
      <div class="text-8xl animate-pop">
        🎉
      </div>
      <h2 class="font-display text-3xl font-extrabold">
        {{ lastResult?.reason === 'confirmed' ? 'Bestätigt!' : 'Gesichert!' }}
      </h2>
      <p class="text-brand-900/70">
        {{
          lastResult?.reason === 'confirmed'
            ? 'Diesen Spot kannten wir schon — Frische-Update gelandet.'
            : 'Dein Mini-Bier-Spot ist jetzt auf der Karte.'
        }}
      </p>
      <div
        v-if="lastResult"
        class="mt-2 font-display text-2xl font-extrabold text-brand-600"
      >
        +{{ lastResult.gained }} XP 🚀
      </div>
    </section>
  </main>
</template>
