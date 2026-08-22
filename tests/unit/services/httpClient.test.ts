import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, get } from '@/services/httpClient'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('httpClient.get', () => {
  it('devuelve el JSON parseado cuando la respuesta es ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ name: 'bulbasaur' }),
      })),
    )

    await expect(get('https://pokeapi.co/api/v2/pokemon/1')).resolves.toEqual({
      name: 'bulbasaur',
    })
  })

  it('lanza ApiError kind "http" cuando la respuesta no es ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        json: async () => ({}),
      })),
    )

    const error = await get('https://pokeapi.co/api/v2/pokemon/no-existe').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).kind).toBe('http')
    expect((error as ApiError).status).toBe(404)
  })

  it('lanza ApiError kind "network" cuando fetch falla sin abort', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )

    const error = await get('https://pokeapi.co/api/v2/pokemon/1').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).kind).toBe('network')
  })

  it('lanza ApiError kind "parse" cuando el body no es JSON válido', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token')
        },
      })),
    )

    const error = await get('https://pokeapi.co/api/v2/pokemon/1').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).kind).toBe('parse')
  })

  it('lanza ApiError kind "timeout" cuando expira el timeout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'))
            })
          }),
      ),
    )

    const error = await get('https://pokeapi.co/api/v2/pokemon/1', { timeoutMs: 5 }).catch(
      (e: unknown) => e,
    )

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).kind).toBe('timeout')
  })

  it('propaga sin envolver el abort del propio llamador', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'))
            })
          }),
      ),
    )

    const controller = new AbortController()
    const promise = get('https://pokeapi.co/api/v2/pokemon/1', { signal: controller.signal })
    controller.abort()

    const error = await promise.catch((e: unknown) => e)

    expect(error).not.toBeInstanceOf(ApiError)
    expect((error as DOMException).name).toBe('AbortError')
  })
})
