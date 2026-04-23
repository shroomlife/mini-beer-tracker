<script setup lang="ts">
useSeoMeta({
  title: 'Anmelden — Mini Beer Tracker',
  description: 'Anmelden oder Account erstellen für den Mini Beer Tracker. Email + Passwort, Argon2id-Hashing, keine Third-Parties.',
  robots: 'noindex,nofollow',
})

const { fetch: refreshSession, loggedIn } = useUserSession()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const form = reactive({
  email: '',
  password: '',
  displayName: '',
})
const loading = ref(false)
const error = ref<string | null>(null)

watch(loggedIn, (v) => {
  if (v) router.replace('/map')
}, { immediate: true })

async function submit(): Promise<void> {
  error.value = null
  loading.value = true
  try {
    if (mode.value === 'register') {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email: form.email,
          password: form.password,
          displayName: form.displayName || undefined,
        },
      })
    }
    else {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: form.email, password: form.password },
      })
    }
    await refreshSession()
    await router.replace('/map')
  }
  catch (e) {
    const msg = (e as { statusMessage?: string, data?: { statusMessage?: string } }).statusMessage
      ?? (e as { data?: { statusMessage?: string } }).data?.statusMessage
      ?? 'Irgendwas ist schiefgelaufen'
    error.value = msg
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex-1 flex flex-col safe-top px-5 md:px-8 pb-10">
    <header class="pt-6 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="btn-ghost h-9 px-2 text-sm gap-1.5"
      >
        <Icon
          name="ph:arrow-left-bold"
          class="size-3.5"
        />
        Zurück
      </NuxtLink>
      <div class="flex items-center gap-2">
        <div class="size-7 rounded-md bg-forest-600 grid place-items-center">
          <span class="text-cream-50 font-display font-semibold text-sm">m</span>
        </div>
        <span class="font-display text-sm font-semibold tracking-tight">Mini Beer Tracker</span>
      </div>
    </header>

    <div class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-sm animate-rise">
        <div class="text-[10px] uppercase tracking-[0.28em] text-malt-500 font-medium text-center">
          {{ mode === 'login' ? 'Willkommen zurück' : 'Neuer Account' }}
        </div>
        <h1 class="mt-3 font-display text-4xl font-semibold text-ink-900 text-center leading-tight">
          {{ mode === 'login' ? 'Anmelden.' : 'Loslegen.' }}
        </h1>

        <div class="mt-8 inline-flex w-full rounded-full bg-cream-50 border border-forest-100 p-1 text-sm font-medium">
          <button
            type="button"
            class="flex-1 py-2 rounded-full transition-colors"
            :class="mode === 'login' ? 'bg-forest-700 text-cream-50' : 'text-ink-500'"
            @click="mode = 'login'"
          >
            Anmelden
          </button>
          <button
            type="button"
            class="flex-1 py-2 rounded-full transition-colors"
            :class="mode === 'register' ? 'bg-forest-700 text-cream-50' : 'text-ink-500'"
            @click="mode = 'register'"
          >
            Registrieren
          </button>
        </div>

        <form
          class="mt-6 flex flex-col gap-4"
          @submit.prevent="submit"
        >
          <label
            v-if="mode === 'register'"
            class="flex flex-col gap-1.5"
          >
            <span class="text-xs uppercase tracking-widest text-ink-500 font-medium">
              Name
              <span class="normal-case tracking-normal text-ink-300">· optional</span>
            </span>
            <input
              v-model="form.displayName"
              type="text"
              autocomplete="nickname"
              placeholder="Wie sollen wir dich nennen?"
              class="rounded-2xl border border-forest-200 px-4 py-3 bg-cream-50 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition"
            >
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-xs uppercase tracking-widest text-ink-500 font-medium">Email</span>
            <input
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              inputmode="email"
              placeholder="du@example.com"
              class="rounded-2xl border border-forest-200 px-4 py-3 bg-cream-50 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition"
            >
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-xs uppercase tracking-widest text-ink-500 font-medium">Passwort</span>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="8"
              :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
              placeholder="mind. 8 Zeichen"
              class="rounded-2xl border border-forest-200 px-4 py-3 bg-cream-50 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition"
            >
          </label>

          <p
            v-if="error"
            class="text-sm text-rust-600"
          >
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary h-12 text-sm disabled:opacity-60 mt-2"
          >
            <Icon
              v-if="loading"
              name="ph:circle-notch-bold"
              class="size-4 animate-spin mr-2"
            />
            {{ mode === 'login' ? 'Anmelden' : 'Account erstellen' }}
          </button>

          <p class="text-[11px] text-ink-500 text-center mt-3 leading-relaxed">
            Passwörter werden mit <strong class="text-ink-700">Argon2id</strong> gehasht. Keine Analytics, keine Third-Parties.
          </p>
        </form>
      </div>
    </div>
  </main>
</template>
