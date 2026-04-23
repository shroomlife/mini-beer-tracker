<script setup lang="ts">
const siteUrl = 'https://beer.shroomlife.de'

useSeoMeta({
  title: 'Mini Beer Tracker',
  description: 'Kleine Biere in Berliner Spätis. Markier deine Funde, teil sie mit anderen — werbefrei und ohne Tracking.',
  ogTitle: 'Mini Beer Tracker',
  ogDescription: 'Kleine Biere in Berliner Spätis.',
  ogUrl: siteUrl,
  ogType: 'website',
  ogLocale: 'de_DE',
  ogImage: `${siteUrl}/og-image.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Mini Beer Tracker',
  twitterDescription: 'Kleine Biere in Berliner Spätis.',
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
        'description': 'Kleine Biere in Berliner Spätis aufspüren.',
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
</script>

<template>
  <div class="min-h-screen flex flex-col bg-cream-50">
    <!-- Top bar -->
    <header class="safe-top px-5 md:px-10 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <LogoMark
          :size="36"
          class="logo-tilt"
        />
        <span class="font-display text-base font-semibold tracking-tight">Mini Beer Tracker</span>
      </div>
      <NuxtLink
        to="/auth"
        class="btn-secondary h-9 px-4 text-sm"
      >
        Anmelden
      </NuxtLink>
    </header>

    <!-- Hero: single-screen -->
    <section class="flex-1 flex flex-col items-center justify-center text-center px-5 py-10">
      <div class="animate-bob mb-10">
        <LogoMark
          :size="150"
          class="md:[width:180px] md:[height:180px] logo-tilt"
        />
      </div>

      <h1 class="font-display text-5xl md:text-7xl font-bold tracking-tight text-ink-900 max-w-2xl leading-[1]">
        Mini Beer Tracker
      </h1>
      <p class="mt-5 text-lg md:text-xl text-ink-700 max-w-md">
        Kleine Biere in Berliner Spätis.
      </p>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink
          to="/auth"
          class="btn-primary h-12 px-8 text-sm"
        >
          Loslegen
        </NuxtLink>
        <a
          href="#features"
          class="btn-ghost h-12 px-4 text-sm"
        >
          Was kann's
        </a>
      </div>
    </section>

    <!-- Feature row -->
    <section
      id="features"
      class="px-5 md:px-10 py-16 bg-cream-100 border-y border-forest-100"
    >
      <div class="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 md:gap-6">
        <div class="flex flex-col items-start gap-3">
          <Icon
            name="ph:map-pin-bold"
            class="size-6 text-forest-600"
          />
          <h3 class="font-display font-semibold text-lg">
            Tippen, fertig
          </h3>
          <p class="text-sm text-ink-700 leading-relaxed">
            Ein Tap im Späti, dein GPS wird zur Späti-Koordinate. Adresse holen wir selbst.
          </p>
        </div>
        <div class="flex flex-col items-start gap-3">
          <Icon
            name="ph:chart-line-up-bold"
            class="size-6 text-forest-600"
          />
          <h3 class="font-display font-semibold text-lg">
            Ehrliche Karte
          </h3>
          <p class="text-sm text-ink-700 leading-relaxed">
            Andere bestätigen oder melden „war nicht da". Die Karte weiß, was aktuell stimmt.
          </p>
        </div>
        <div class="flex flex-col items-start gap-3">
          <Icon
            name="ph:lock-key-open-bold"
            class="size-6 text-forest-600"
          />
          <h3 class="font-display font-semibold text-lg">
            Keine Tracker
          </h3>
          <p class="text-sm text-ink-700 leading-relaxed">
            Argon2id-Passwörter, Session-Cookies, sonst nix. Kein Analytics, keine Werbung.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-5 md:px-10 py-16">
      <div class="max-w-3xl mx-auto rounded-[28px] bg-forest-700 text-cream-50 px-8 md:px-12 py-12 text-center relative overflow-hidden">
        <div
          aria-hidden="true"
          class="absolute -top-16 -right-16 size-60 rounded-full bg-forest-500/30 blur-3xl"
        />
        <div class="relative">
          <h2 class="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Beim nächsten Späti dran denken.
          </h2>
          <NuxtLink
            to="/auth"
            class="mt-7 inline-flex btn-primary h-11 px-7 text-sm bg-cream-50 !text-forest-900 hover:bg-cream-100"
          >
            Account anlegen
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-forest-100 px-5 md:px-10 py-6 safe-bottom">
      <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-ink-500">
        <span>Mini Beer Tracker · Berlin</span>
        <a
          href="https://github.com/shroomlife/mini-beer-tracker"
          class="hover:text-forest-700"
        >GitHub</a>
      </div>
    </footer>
  </div>
</template>
