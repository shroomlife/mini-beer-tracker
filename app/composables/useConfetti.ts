/**
 * Tiny zero-dep confetti. Emojis regnen vom Top-Center über den Viewport.
 * Für volles "Yay!"-Feedback nach einem Save.
 */
export function useConfetti() {
  const active = ref(false)
  const pieces = ref<Array<{
    id: number
    emoji: string
    x: number
    delay: number
    duration: number
    drift: number
    rotate: number
  }>>([])

  const emojis = ['🍺', '🤏', '✨', '💚', '🎉', '🟢']

  function celebrate(): void {
    if (!import.meta.client) return
    const count = 42
    pieces.value = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]!,
      x: Math.random() * 100,
      delay: Math.random() * 250,
      duration: 1800 + Math.random() * 1400,
      drift: (Math.random() - 0.5) * 120,
      rotate: (Math.random() - 0.5) * 720,
    }))
    active.value = true
    setTimeout(() => {
      active.value = false
      pieces.value = []
    }, 3400)
  }

  return { active, pieces, celebrate }
}
