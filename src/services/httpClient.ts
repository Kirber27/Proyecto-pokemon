export type ApiErrorKind = 'network' | 'http' | 'timeout' | 'parse'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly url: string
  readonly status?: number

  constructor(kind: ApiErrorKind, url: string, status?: number, options?: ErrorOptions) {
    super(`[${kind}] ${url}`, options)
    this.name = 'ApiError'
    this.kind = kind
    this.url = url
    this.status = status
  }
}

export interface HttpGetOptions {
  signal?: AbortSignal
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 10_000

/**
 * GET tipado con timeout y AbortController propios. No reintenta: reintentar es una
 * decisión de la UI (botón "Reintentar").
 */
export async function get<T>(url: string, options: HttpGetOptions = {}): Promise<T> {
  const timeoutSignal = AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal

  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (timeoutSignal.aborted) {
      throw new ApiError('timeout', url, undefined, { cause: error })
    }
    // El llamador canceló su propio signal (p. ej. búsqueda superada, salida de ruta):
    // no es un fallo de red, se propaga tal cual para que el llamador lo ignore si quiere.
    if (options.signal?.aborted) {
      throw error
    }
    throw new ApiError('network', url, undefined, { cause: error })
  }

  if (!response.ok) {
    throw new ApiError('http', url, response.status)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new ApiError('parse', url, response.status, { cause: error })
  }
}
