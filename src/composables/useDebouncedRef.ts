import { customRef } from 'vue'

/**
 * Ref cuya escritura se demora `delay` ms — cada nueva escritura reinicia el timer.
 * Reutilizado por SearchBar (CA-03.2) y por PokemonGrid para debouncear @visible.
 */
export function useDebouncedRef<T>(initialValue: T, delay = 250) {
  let value = initialValue
  let timeout: ReturnType<typeof setTimeout> | undefined

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue: T) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value = newValue
        trigger()
      }, delay)
    },
  }))
}
