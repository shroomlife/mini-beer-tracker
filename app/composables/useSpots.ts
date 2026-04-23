import type { Spot, NewSpotInput, SpotActionResult } from '~~/shared/types/spot'

export function useSpots() {
  const spots = useState<Spot[]>('spots', () => [])
  const loading = useState<boolean>('spots:loading', () => false)
  const error = useState<string | null>('spots:error', () => null)
  const { trigger } = useXpFeedback()

  async function refresh(near?: { lat: number, lon: number }): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const query = near ? { lat: String(near.lat), lon: String(near.lon) } : undefined
      const data = await $fetch<Spot[]>('/api/spots', { query })
      spots.value = data
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Laden'
    }
    finally {
      loading.value = false
    }
  }

  async function add(input: NewSpotInput): Promise<SpotActionResult> {
    const res = await $fetch<SpotActionResult>('/api/spots', {
      method: 'POST',
      body: input,
    })
    trigger(res.xp)
    await refresh()
    return res
  }

  async function confirm(id: string): Promise<SpotActionResult> {
    const res = await $fetch<SpotActionResult>(`/api/spots/${id}/confirm`, { method: 'POST' })
    trigger(res.xp)
    await refresh()
    return res
  }

  async function notFound(id: string): Promise<SpotActionResult> {
    const res = await $fetch<SpotActionResult>(`/api/spots/${id}/not-found`, { method: 'POST' })
    trigger(res.xp)
    await refresh()
    return res
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`/api/spots/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return { spots, loading, error, refresh, add, confirm, notFound, remove }
}
