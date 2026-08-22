import { ref, watch, type Ref } from 'vue'
import { usePokemonStore } from '@/stores/usePokemonStore'
import type { PokemonDetail } from '@/types/domain'

export type DetailLoadStatus = 'idle' | 'loading' | 'ready' | 'error'

/**
 * Carga el detalle completo (base + species + debilidades) de `name`, tolerante a
 * fallos (CA-05.4) y contenida (CA-09.3): un fallo acá no tumba el resto de la app.
 * Compartido por PokemonDetailView (mobile) y el panel master-detail (desktop).
 */
export function usePokemonDetailLoader(name: Ref<string | undefined>) {
  const pokemonStore = usePokemonStore()
  const detail = ref<PokemonDetail>()
  const status = ref<DetailLoadStatus>('idle')

  async function load(): Promise<void> {
    const requestedName = name.value

    if (!requestedName) {
      status.value = 'idle'
      detail.value = undefined
      return
    }

    status.value = 'loading'
    const result = await pokemonStore.loadFullDetail(requestedName)

    if (name.value !== requestedName) return // el nombre cambió mientras esperábamos

    if (result) {
      detail.value = result
      status.value = 'ready'
    } else {
      detail.value = undefined
      status.value = 'error'
    }
  }

  watch(name, load, { immediate: true })

  return { detail, status, reload: load }
}
