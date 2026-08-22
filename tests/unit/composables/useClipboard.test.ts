import { afterEach, describe, expect, it, vi } from 'vitest'
import { useClipboard } from '@/composables/useClipboard'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('useClipboard', () => {
  it('usa la Clipboard API cuando está disponible', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const { copied, error, copy } = useClipboard()
    await copy('hola')

    expect(writeText).toHaveBeenCalledWith('hola')
    expect(copied.value).toBe(true)
    expect(error.value).toBe(false)
  })

  it('confirma la copia y se resetea sola a los 2s (CA-07.3)', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })

    const { copied, copy } = useClipboard()
    await copy('hola')

    expect(copied.value).toBe(true)

    await vi.advanceTimersByTimeAsync(2000)
    expect(copied.value).toBe(false)
  })

  it('usa el fallback si la Clipboard API no está disponible (CA-07.4)', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = vi.fn().mockReturnValue(true)

    const { copied, error, copy } = useClipboard()
    await copy('hola')

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(copied.value).toBe(true)
    expect(error.value).toBe(false)
  })

  it('usa el fallback si la Clipboard API falla', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    document.execCommand = vi.fn().mockReturnValue(true)

    const { copied, error, copy } = useClipboard()
    await copy('hola')

    expect(copied.value).toBe(true)
    expect(error.value).toBe(false)
  })

  it('informa el error si tanto la Clipboard API como el fallback fallan (CA-07.4)', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = vi.fn().mockReturnValue(false)

    const { copied, error, copy } = useClipboard()
    await copy('hola')

    expect(copied.value).toBe(false)
    expect(error.value).toBe(true)
  })
})
