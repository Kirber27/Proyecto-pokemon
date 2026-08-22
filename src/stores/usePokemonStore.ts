import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getDetail, getIndex, getSpecies, getTypeInfo } from '@/services/pokemonService'
import { useConcurrencyPool } from '@/composables/useConcurrencyPool'
import type { TypeInfo } from '@/services/mappers/pokemonMapper'
import type { PokemonDetail, PokemonSummary, PokemonType } from '@/types/domain'

export type IndexStatus = 'idle' | 'loading' | 'ready' | 'error'

const DETAIL_CONCURRENCY = 6

export const usePokemonStore = defineStore('pokemon', () => {
  const index = ref<PokemonSummary[]>([])
  const details = reactive(new Map<string, PokemonDetail>())
  const indexStatus = ref<IndexStatus>('idle')
  // Debilidades (detalle) y miembros (filtro por tipo) — 18 posibles claves, cacheables.
  const typeInfo = reactive(new Map<PokemonType, TypeInfo>())

  // Deduplicación de peticiones en vuelo — no es estado reactivo, es bookkeeping interno.
  const inFlight = new Map<string, Promise<void>>()

  const byName = computed(() => (name: string) => details.get(name))

  /** Índice completo con un único request — idempotente, permite reintentar tras error. */
  async function loadIndex(): Promise<void> {
    if (indexStatus.value === 'loading' || indexStatus.value === 'ready') return

    indexStatus.value = 'loading'

    try {
      index.value = await getIndex()
      indexStatus.value = 'ready'
    } catch {
      indexStatus.value = 'error'
    }
  }

  /**
   * Hidrata el detalle de `names`, saltando los ya cacheados y los ya en vuelo,
   * con un máximo de `DETAIL_CONCURRENCY` peticiones simultáneas.
   */
  async function ensureDetails(names: string[]): Promise<void> {
    const pending = [...new Set(names)].filter((name) => !details.has(name) && !inFlight.has(name))

    if (pending.length === 0) return

    const tasks = pending.map((name) => {
      let resolveTask!: () => void
      let rejectTask!: (error: unknown) => void
      const placeholder = new Promise<void>((resolve, reject) => {
        resolveTask = resolve
        rejectTask = reject
      })

      inFlight.set(name, placeholder)
      // Un fallo puntual no debe volverse un unhandled rejection: el error de esta tarea
      // no debe tumbar a las demás (CA-09.3), solo queda sin detalle cacheado.
      placeholder.catch(() => {})

      return async () => {
        try {
          details.set(name, await getDetail(name))
          resolveTask()
        } catch (error) {
          rejectTask(error)
        } finally {
          inFlight.delete(name)
        }
      }
    })

    const runPool = useConcurrencyPool(DETAIL_CONCURRENCY)
    await runPool(tasks)
  }

  /** Fetch de `/type/{name}` solo para los tipos aún no cacheados (máx. 18 posibles). */
  async function ensureTypeInfo(types: PokemonType[]): Promise<void> {
    const pending = [...new Set(types)].filter((type) => !typeInfo.has(type))

    if (pending.length === 0) return

    const results = await Promise.all(
      pending.map((type) => getTypeInfo(type).catch(() => undefined)),
    )

    pending.forEach((type, i) => {
      const result = results[i]
      if (result) typeInfo.set(type, result)
    })
  }

  /**
   * Detalle + species + debilidades. Tolerante a fallos parciales: si species o el tipo
   * fallan, el resto del detalle se muestra igual, solo faltan esas secciones.
   */
  async function loadFullDetail(name: string): Promise<PokemonDetail | undefined> {
    await ensureDetails([name])

    const base = details.get(name)
    if (!base) return undefined

    const primaryType = base.types[0]

    const [species] = await Promise.all([
      getSpecies(base.id).catch(() => null),
      primaryType ? ensureTypeInfo([primaryType]) : Promise.resolve(),
    ])

    const weaknesses = primaryType ? typeInfo.get(primaryType)?.weaknesses : undefined

    const merged: PokemonDetail = {
      ...base,
      ...(species ?? {}),
      weaknesses,
    }

    details.set(name, merged)
    return merged
  }

  return {
    index,
    details,
    indexStatus,
    typeInfo,
    byName,
    loadIndex,
    ensureDetails,
    ensureTypeInfo,
    loadFullDetail,
  }
})
