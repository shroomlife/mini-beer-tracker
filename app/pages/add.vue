<script setup lang="ts">
import type { GeocodeResult } from '~~/shared/types/spot'

useSeoMeta({
  title: 'Spot anlegen — Mini Beer Tracker',
  robots: 'noindex,nofollow',
})

type Step = 'intro' | 'locating' | 'confirm' | 'saved'
const step = ref<Step>('intro')

const { coords, error: locError, locate } = useCurrentLocation()
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
        || 'Späti'
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
    name: form.name.trim() || 'Späti',
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
  <main class="relative flex-1 flex flex-col safe-top px-5 md:px-8 pb-36">
    <ConfettiLayer
      :active="confettiActive"
      :pieces="confettiPieces"
    />

    <!-- Intro -->
    <section
      v-if="step === 'intro'"
      class="flex-1 flex flex-col items-center justify-center text-center gap-7 max-w-md mx-auto"
    >
      <LogoMark
        :size="80"
        class="animate-bob"
      />
      <h1 class="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink-900">
        Mini-Bier gesichtet?
      </h1>
      <p class="text-ink-700 max-w-sm">
        Ein Tap und wir speichern GPS plus Adresse für dich.
      </p>

      <button
        type="button"
        class="btn-primary h-16 w-full max-w-xs text-base font-semibold"
        @click="startCapture"
      >
        Hier gibt's welche
      </button>

      <p
        v-if="locError"
        class="text-rust-600 text-sm"
      >
        {{ locError }}
      </p>

      <p class="text-xs text-ink-500 max-w-xs leading-relaxed">
        Standort wird nur genommen wenn du tippst.
      </p>
    </section>

    <!-- Locating -->
    <section
      v-else-if="step === 'locating'"
      class="flex-1 flex flex-col items-center justify-center text-center gap-6"
    >
      <div class="size-12 rounded-full border-2 border-forest-200 border-t-forest-600 animate-spin" />
      <h2 class="font-display text-2xl font-semibold text-ink-900">
        Standort wird ermittelt
      </h2>
      <p class="text-sm text-ink-500 max-w-sm">
        Bitte erlaube kurz den Zugriff, falls dein Browser fragt.
      </p>
    </section>

    <!-- Confirm -->
    <section
      v-else-if="step === 'confirm'"
      class="flex-1 flex flex-col gap-5 max-w-md mx-auto w-full pt-8"
    >
      <header>
        <button
          type="button"
          class="btn-ghost h-8 px-2 text-xs gap-1.5"
          @click="step = 'intro'"
        >
          <Icon
            name="ph:arrow-left-bold"
            class="size-3.5"
          />
          Nochmal
        </button>
        <h2 class="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900">
          Details
        </h2>
      </header>

      <div class="card p-5">
        <div class="text-xs text-ink-500 font-medium">
          Adresse
        </div>
        <div class="mt-2">
          <p
            v-if="geoLoading"
            class="text-sm text-ink-500"
          >
            Wird geladen…
          </p>
          <p
            v-else-if="geoError"
            class="text-sm text-rust-600"
          >
            {{ geoError }}
          </p>
          <div
            v-else-if="geo"
            class="text-sm"
          >
            <p class="font-display text-lg font-medium text-ink-900">
              {{ addressPretty || geo.displayName }}
            </p>
            <p
              v-if="geo.suburb"
              class="text-ink-500 mt-0.5"
            >
              {{ geo.suburb }}
            </p>
          </div>
          <p
            v-if="coords"
            class="mt-3 font-mono text-[11px] text-ink-500 tabular-nums"
          >
            {{ coords.lat.toFixed(5) }}, {{ coords.lon.toFixed(5) }} · ±{{ Math.round(coords.accuracy) }}m
          </p>
        </div>
      </div>

      <form
        class="flex flex-col gap-4"
        @submit.prevent="save"
      >
        <label class="flex flex-col gap-1.5">
          <span class="text-xs text-ink-700 font-medium">Name</span>
          <input
            v-model="form.name"
            type="text"
            placeholder="z. B. Späti an der Ecke"
            class="rounded-2xl border border-forest-200 px-4 py-3 bg-cream-50 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition"
            required
          >
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-xs text-ink-700 font-medium">
            Preis
            <span class="text-ink-300 font-normal">· optional</span>
          </span>
          <div class="relative">
            <input
              v-model="form.priceEuros"
              type="text"
              inputmode="decimal"
              placeholder="1,50"
              class="w-full rounded-2xl border border-forest-200 px-4 py-3 pr-10 bg-cream-50 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition tabular-nums"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500">€</span>
          </div>
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-xs text-ink-700 font-medium">
            Notiz
            <span class="text-ink-300 font-normal">· optional</span>
          </span>
          <textarea
            v-model="form.vibe"
            rows="2"
            placeholder="Freundliche Kassenkraft, immer gut gekühlt…"
            class="rounded-2xl border border-forest-200 px-4 py-3 bg-cream-50 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none resize-none transition"
          />
        </label>

        <button
          type="submit"
          :disabled="!geo || !coords"
          class="btn-primary h-12 text-sm disabled:opacity-50 mt-2"
        >
          Spot speichern
        </button>
      </form>
    </section>

    <!-- Saved -->
    <section
      v-else-if="step === 'saved'"
      class="flex-1 flex flex-col items-center justify-center text-center gap-5 animate-rise"
    >
      <div class="size-14 rounded-full bg-forest-600 grid place-items-center">
        <Icon
          name="ph:check-bold"
          class="size-7 text-cream-50"
        />
      </div>
      <h2 class="font-display text-3xl font-semibold text-ink-900">
        {{ lastResult?.reason === 'confirmed' ? 'Bestätigt' : 'Gespeichert' }}
      </h2>
      <p class="text-ink-700 max-w-xs">
        {{
          lastResult?.reason === 'confirmed'
            ? 'Kannten wir schon — Frische aktualisiert.'
            : 'Dein Spot steht jetzt auf der Karte.'
        }}
      </p>
      <div
        v-if="lastResult"
        class="font-display text-xl text-malt-600 tabular-nums"
      >
        +{{ lastResult.gained }} XP
      </div>
    </section>
  </main>
</template>
