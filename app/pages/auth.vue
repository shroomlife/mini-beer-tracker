<script setup lang="ts">
useHead({ title: 'Mini Beer Tracker — Login' })

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
  if (v) router.replace('/')
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
    await router.replace('/')
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
  <main class="flex-1 flex flex-col items-center justify-center safe-top px-5 pb-28">
    <div class="w-full max-w-sm">
      <div class="text-center mb-6">
        <div class="text-6xl animate-wiggle inline-block">
          🍺🤏
        </div>
        <h1 class="font-display text-3xl font-extrabold mt-2">
          Mini Beer Tracker
        </h1>
        <p class="text-sm text-brand-900/60 mt-1">
          {{ mode === 'login' ? 'Willkommen zurück!' : 'Neuen Account anlegen' }}
        </p>
      </div>

      <div class="inline-flex w-full rounded-full bg-white border-2 border-brand-200 p-1 text-sm font-semibold mb-4">
        <button
          type="button"
          class="flex-1 py-2 rounded-full transition-colors"
          :class="mode === 'login' ? 'bg-brand-500 text-white' : 'text-brand-900/70'"
          @click="mode = 'login'"
        >
          Login
        </button>
        <button
          type="button"
          class="flex-1 py-2 rounded-full transition-colors"
          :class="mode === 'register' ? 'bg-brand-500 text-white' : 'text-brand-900/70'"
          @click="mode = 'register'"
        >
          Registrieren
        </button>
      </div>

      <form
        class="flex flex-col gap-3"
        @submit.prevent="submit"
      >
        <label
          v-if="mode === 'register'"
          class="flex flex-col gap-1"
        >
          <span class="text-sm font-semibold text-brand-900/80">Name <span class="text-brand-900/40 font-normal">(optional)</span></span>
          <input
            v-model="form.displayName"
            type="text"
            autocomplete="nickname"
            placeholder="Wie sollen wir dich nennen?"
            class="rounded-2xl border-2 border-brand-200 px-4 py-3 bg-white focus:border-brand-500 outline-none"
          >
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-brand-900/80">Email</span>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            inputmode="email"
            placeholder="du@example.com"
            class="rounded-2xl border-2 border-brand-200 px-4 py-3 bg-white focus:border-brand-500 outline-none"
          >
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-brand-900/80">Passwort</span>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="8"
            :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
            placeholder="mind. 8 Zeichen"
            class="rounded-2xl border-2 border-brand-200 px-4 py-3 bg-white focus:border-brand-500 outline-none"
          >
        </label>

        <p
          v-if="error"
          class="text-sm text-pop-500 font-medium"
        >
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="btn-chunk h-14 bg-brand-500 text-white font-display text-lg font-bold mt-2 disabled:opacity-60 disabled:shadow-none"
        >
          <Icon
            v-if="loading"
            name="mdi:loading"
            class="size-5 animate-spin mr-2"
          />
          {{ mode === 'login' ? '🍺 Einloggen' : '🍺 Los gehts' }}
        </button>

        <p class="text-[11px] text-brand-900/50 text-center mt-2">
          Passwörter werden mit <strong>Argon2id</strong> (via Bun native) gehasht.
          Wir speichern nur Email und optional deinen Namen.
        </p>
      </form>
    </div>
  </main>
</template>
