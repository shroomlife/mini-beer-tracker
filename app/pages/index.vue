<script setup lang="ts">
const siteUrl = 'https://beer.shroomlife.de'

useSeoMeta({
  title: 'Mini Beer Tracker — Das Späti-Verzeichnis für Mini-Heinekens in Berlin',
  description: 'Gemeinsam finden wir jeden Späti in Berlin, der die kleinen 0,15-Liter-Heinekens führt. Crowdsourced, werbefrei, ohne Tracking.',
  ogTitle: 'Mini Beer Tracker — Mini-Heinekens in Berliner Spätis',
  ogDescription: 'Gemeinsam finden wir jeden Späti in Berlin, der die kleinen 0,15-Liter-Heinekens führt.',
  ogUrl: siteUrl,
  ogType: 'website',
  ogLocale: 'de_DE',
  ogImage: `${siteUrl}/og-image.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Mini Beer Tracker',
  twitterDescription: 'Die kleinen 0,15-Liter-Heinekens — gemeinsam in Berlin aufspüren.',
  twitterImage: `${siteUrl}/og-image.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl + '/' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Mini Beer Tracker',
        'url': siteUrl,
        'description': 'Crowdsourced Mini-Heineken-Tracker für Berliner Spätis.',
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'Any (Web / PWA)',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR' },
        'areaServed': { '@type': 'City', 'name': 'Berlin' },
        'inLanguage': 'de-DE',
      }),
    },
  ],
})

definePageMeta({
  layout: false,
})

const year = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-cream-50">
    <!-- Top bar -->
    <header class="safe-top px-6 md:px-10 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <img
          src="/logo.svg"
          alt=""
          class="size-10"
          aria-hidden="true"
        >
        <span class="font-display text-lg font-semibold tracking-tight">Mini Beer Tracker</span>
      </div>
      <NuxtLink
        to="/auth"
        class="btn-secondary h-9 px-4 text-sm"
      >
        Anmelden
      </NuxtLink>
    </header>

    <!-- Hero -->
    <section class="flex-1 px-6 md:px-10 py-14 md:py-24 max-w-6xl mx-auto w-full">
      <div class="grid md:grid-cols-[1.2fr_1fr] gap-14 md:gap-20 items-center">
        <div class="animate-rise">
          <div class="text-[11px] uppercase tracking-[0.28em] text-malt-500 font-medium">
            Berlin · Crowdsourced · Werbefrei
          </div>
          <h1 class="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.95] text-ink-900">
            Das Späti&#8209;Verzeichnis
            <span class="text-forest-600 italic font-normal">für Mini&#8209;Biere.</span>
          </h1>
          <p class="mt-6 text-lg text-ink-700 leading-relaxed max-w-xl">
            Gemeinsam finden wir in Berlin jeden Späti, der die kleinen
            0,15&#8209;Liter&#8209;Heinekens führt. Du markierst, wo du welche
            entdeckt hast — und alle wissen Bescheid.
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-3">
            <NuxtLink
              to="/auth"
              class="btn-primary h-12 px-7 text-sm"
            >
              Mitmachen
              <Icon
                name="ph:arrow-right-bold"
                class="ml-2 size-4"
              />
            </NuxtLink>
            <a
              href="#how"
              class="btn-ghost h-12 px-4 text-sm"
            >
              So funktioniert's
            </a>
          </div>

          <dl class="mt-14 grid grid-cols-3 gap-6 max-w-md border-t border-forest-100 pt-8">
            <div>
              <dt class="text-[10px] uppercase tracking-widest text-ink-500 font-medium">
                Präzision
              </dt>
              <dd class="mt-1 font-display text-2xl font-semibold text-forest-700 tabular-nums">
                ±5 m
              </dd>
            </div>
            <div>
              <dt class="text-[10px] uppercase tracking-widest text-ink-500 font-medium">
                API Keys
              </dt>
              <dd class="mt-1 font-display text-2xl font-semibold text-forest-700 tabular-nums">
                0
              </dd>
            </div>
            <div>
              <dt class="text-[10px] uppercase tracking-widest text-ink-500 font-medium">
                Tracker
              </dt>
              <dd class="mt-1 font-display text-2xl font-semibold text-forest-700 tabular-nums">
                keine
              </dd>
            </div>
          </dl>
        </div>

        <!-- Hero visual: logo + subtle map backdrop -->
        <div class="relative mx-auto w-full max-w-[440px] aspect-square">
          <!-- Backdrop: layered soft circles evoking a map/radar -->
          <div
            aria-hidden="true"
            class="absolute inset-0 grid place-items-center"
          >
            <div class="absolute size-[88%] rounded-full border border-forest-200/60" />
            <div class="absolute size-[66%] rounded-full border border-forest-200/80" />
            <div class="absolute size-[44%] rounded-full border border-forest-300/80" />
            <div class="absolute size-[22%] rounded-full bg-forest-100/50" />
            <!-- Decorative pins on the outer ring -->
            <span
              class="absolute size-3 rounded-full bg-forest-500"
              style="top: 12%; left: 30%;"
            />
            <span
              class="absolute size-3 rounded-full bg-malt-400"
              style="top: 26%; right: 14%;"
            />
            <span
              class="absolute size-3 rounded-full bg-forest-600"
              style="bottom: 18%; left: 22%;"
            />
            <span
              class="absolute size-3 rounded-full bg-rust-500"
              style="bottom: 28%; right: 20%;"
            />
          </div>
          <!-- Logo centered -->
          <img
            src="/logo.svg"
            alt="Mini Beer Tracker Emblem"
            class="absolute inset-0 m-auto w-[70%] h-[70%] object-contain animate-pulse-soft"
          >
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section
      id="how"
      class="px-6 md:px-10 py-20 bg-cream-100 border-y border-forest-100"
    >
      <div class="max-w-5xl mx-auto">
        <div class="text-[11px] uppercase tracking-[0.28em] text-malt-500 font-medium">
          So funktioniert's
        </div>
        <h2 class="mt-3 font-display text-4xl md:text-5xl font-semibold leading-tight text-ink-900 max-w-3xl">
          Drei Schritte — mehr Mini&#8209;Biere fürs Kollektiv.
        </h2>

        <ol class="mt-14 grid md:grid-cols-3 gap-10">
          <li>
            <div class="font-display text-5xl font-semibold text-forest-500 tabular-nums leading-none">
              01
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-ink-900">
              Entdecken
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-700">
              Du stehst im Späti, in der Kühltheke liegt ein 0,15-Liter-Heineken. Tippe einmal auf den Knopf.
            </p>
          </li>
          <li>
            <div class="font-display text-5xl font-semibold text-forest-500 tabular-nums leading-none">
              02
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-ink-900">
              Markieren
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-700">
              Wir nehmen dein GPS (mit Erlaubnis), lesen die Adresse via OpenStreetMap und speichern den Spot.
            </p>
          </li>
          <li>
            <div class="font-display text-5xl font-semibold text-forest-500 tabular-nums leading-none">
              03
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-ink-900">
              Verifizieren
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-700">
              Andere bestätigen, wenn der Späti noch führt — oder melden "war nicht da". So bleibt die Karte ehrlich.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Features -->
    <section class="px-6 md:px-10 py-20">
      <div class="max-w-5xl mx-auto">
        <div class="text-[11px] uppercase tracking-[0.28em] text-malt-500 font-medium">
          Was drin steckt
        </div>
        <h2 class="mt-3 font-display text-4xl md:text-5xl font-semibold leading-tight text-ink-900 max-w-3xl">
          Sorgfältig gemacht. Nicht laut, nicht voll&#8209;getrackt.
        </h2>

        <div class="mt-14 grid md:grid-cols-2 gap-x-12 gap-y-12">
          <Feature
            icon="ph:map-trifold-bold"
            title="Leaflet &amp; OpenStreetMap"
            body="Keine Google-Maps-API-Keys, keine Billing-Überraschungen. Die Kacheln cachen sich offline für die nächste Spätirunde."
          />
          <Feature
            icon="ph:chart-line-up-bold"
            title="Bayesian Confidence"
            body="Jeder Spot bekommt einen Wahrscheinlichkeits-Score, der Bestätigungen und Leer-Meldungen mit Laplace-Smoothing verrechnet."
          />
          <Feature
            icon="ph:trophy-bold"
            title="XP &amp; Ränge"
            body="Von 'Späti-Neuling' bis 'Ewige Mini-Gottheit'. Ein leichtes Gamification-Layer, das Mitmachen belohnt."
          />
          <Feature
            icon="ph:lock-key-open-bold"
            title="Argon2id, Session-Cookies"
            body="Passwörter nativ über Bun's Argon2id. Sessions als HttpOnly-Cookies. Keine Third-Party-Analytics, keine Cookies von außen."
          />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-6 md:px-10 pb-20">
      <div class="max-w-5xl mx-auto">
        <div class="rounded-[2rem] bg-forest-700 text-cream-50 px-10 md:px-16 py-16 md:py-20 relative overflow-hidden">
          <div
            aria-hidden="true"
            class="absolute -top-20 -right-20 size-72 rounded-full bg-forest-500/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            class="absolute -bottom-24 -left-12 size-80 rounded-full bg-malt-500/20 blur-3xl"
          />
          <div class="relative">
            <h2 class="font-display text-4xl md:text-6xl font-semibold leading-tight max-w-2xl">
              Eine Karte aus
              <span class="italic text-malt-400">tausend Sätzen</span>
              „ja, hier gab's welche".
            </h2>
            <p class="mt-6 text-cream-100/80 max-w-xl leading-relaxed">
              Jede Markierung macht die nächste Mini-Bier-Mission ein Stück leichter.
            </p>
            <NuxtLink
              to="/auth"
              class="mt-10 inline-flex items-center btn-primary h-12 px-8 text-sm bg-cream-50 !text-forest-900 hover:bg-cream-100"
            >
              Anmelden &amp; loslegen
              <Icon
                name="ph:arrow-right-bold"
                class="ml-2 size-4"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-forest-100 px-6 md:px-10 py-8">
      <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-ink-500">
        <div>
          © {{ year }} Mini Beer Tracker · <a
            href="https://github.com/shroomlife/mini-beer-tracker"
            class="underline underline-offset-4 hover:text-forest-700"
          >Open Source</a>
        </div>
        <div class="flex items-center gap-5">
          <NuxtLink
            to="/auth"
            class="hover:text-forest-700"
          >
            Anmelden
          </NuxtLink>
          <a
            href="https://github.com/shroomlife/mini-beer-tracker"
            class="hover:text-forest-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
