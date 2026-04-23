import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  modules: [
    '@nuxt/icon',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    'nuxt-auth-utils',
  ],
  ssr: true,
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Mini Beer Tracker',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no',
      meta: [
        { name: 'description', content: 'Crowdsourced Mini-Heineken-Tracker für Berliner Spätis. Finde 0,15-l-Biere in deiner Nähe, teile Fundorte und trackt gemeinsam, wo es die kleinen gibt.' },
        { name: 'theme-color', content: '#1E5D3F' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/icon.svg' },
        { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // ENV-Override: NUXT_NOMINATIM_USER_AGENT
    nominatimUserAgent: 'MiniBeerTracker/0.1 (robin@shroomlife.de)',
    public: {
      // absichtlich leer — keine clientseitigen runtime-configs
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-15',

  nitro: {
    experimental: { openAPI: false },
    routeRules: {
      // Service Worker darf NIE gecached werden — sonst bleiben Clients
      // auf alter PWA-Version hängen.
      '/sw.js': { headers: { 'cache-control': 'no-cache, no-store, must-revalidate' } },
      '/manifest.webmanifest': { headers: { 'cache-control': 'no-cache' } },
      // Immutable Build-Assets (Hash im Filename) — lange cachebar.
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Mini Beer Tracker',
      short_name: 'MiniBeer',
      description: 'Mini-Heinekens in freier Wildbahn tracken.',
      theme_color: '#006B3F',
      background_color: '#FFF9ED',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
      ],
    },
    workbox: {
      // SSR: true → keine SPA-Navigation-Fallback. Der Server rendert Pages,
      // der SW soll Navigationen nicht auf eine einzige HTML-Antwort mappen
      // (sonst bekommt der User offline stale Index-HTML für /spots etc.).
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'osm-tiles',
            expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },
})
