import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedRef } from '@/composables/useDebouncedRef'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebouncedRef', () => {
  it('arranca con el valor inicial', () => {
    const debounced = useDebouncedRef('a')

    expect(debounced.value).toBe('a')
  })

  it('no actualiza el valor hasta que pasa el delay', () => {
    const debounced = useDebouncedRef('a', 250)

    debounced.value = 'b'
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(50)
    expect(debounced.value).toBe('b')
  })

  it('cada escritura reinicia el timer (solo se aplica la última)', () => {
    const debounced = useDebouncedRef('a', 250)

    debounced.value = 'b'
    vi.advanceTimersByTime(200)
    debounced.value = 'c'
    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(50)
    expect(debounced.value).toBe('c')
  })

  it('usa 250ms por defecto', () => {
    const debounced = useDebouncedRef('a')

    debounced.value = 'b'
    vi.advanceTimersByTime(249)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(1)
    expect(debounced.value).toBe('b')
  })
})
