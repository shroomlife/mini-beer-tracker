export function useHaptic() {
  function supported(): boolean {
    return import.meta.client === true && 'vibrate' in navigator
  }

  function tap(): void {
    if (supported()) navigator.vibrate(15)
  }
  function success(): void {
    if (supported()) navigator.vibrate([25, 40, 60])
  }
  function celebrate(): void {
    if (supported()) navigator.vibrate([60, 40, 60, 40, 120])
  }
  function nope(): void {
    if (supported()) navigator.vibrate([30, 30, 30])
  }

  return { tap, success, celebrate, nope }
}
