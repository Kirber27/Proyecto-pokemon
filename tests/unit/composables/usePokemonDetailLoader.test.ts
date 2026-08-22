import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { usePokemonDetailLoader } from '@/composables/usePokemonDetailLoader'
import { getDetail, getSpecies, getTypeInfo } from '@/services/pokemonService'
import type { PokemonDetail } from '@/types/domain'

vi.mock('@/services/pokemonService', () => ({
  getIndex: vi.fn(),
  getDetail: vi.fn(),
  getSpecies: vi.fn(),
  getTypeInfo: vi.fn(),
}))

function detail(name: string): PokemonDetail {
  return {
    id: 1,
    name,
    displayName: name,
    number: 'Nº1',
    artworkUrl: '1.png',
    types: ['grass'],
    weightKg: 6.9,
    heightM: 0.7,
    abilities: [],
    stats: [],
  }
}

function mountLoader(name: ReturnType<typeof ref<string | undefined>>) {
  let result!: ReturnType<typeof usePokemonDetailLoader>

  const TestComponent = defineComponent({
    setup() {
      result = usePokemonDetailLoader(name)
      return () => h('div')
    },
  })

  mount(TestComponent)
  return result
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.mocked(getDetail).mockReset()
  vi.mocked(getSpecies).mockReset()
  vi.mocked(getTypeInfo).mockReset()
  vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: [], members: [] })
})

describe('usePokemonDetailLoader', () => {
  it('carga el detalle y pasa por loading → ready', async () => {
    vi.mocked(getDetail).mockResolvedValue(detail('bulbasaur'))
    vi.mocked(getSpecies).mockResolvedValue({})
    const name = ref<string | undefined>('bulbasaur')

    const { status, detail: loaded } = mountLoader(name)
    expect(status.value).toBe('loading')

    await vi.waitFor(() => expect(status.value).toBe('ready'))
    expect(loaded.value?.displayName).toBe('bulbasaur')
  })

  it('pasa a error si el detalle base falla', async () => {
    vi.mocked(getDetail).mockRejectedValue(new Error('down'))
    const name = ref<string | undefined>('bulbasaur')

    const { status } = mountLoader(name)

    await vi.waitFor(() => expect(status.value).toBe('error'))
  })

  it('arranca en idle si no hay nombre', () => {
    const name = ref<string | undefined>(undefined)

    const { status } = mountLoader(name)

    expect(status.value).toBe('idle')
    expect(getDetail).not.toHaveBeenCalled()
  })

  it('recarga cuando cambia el nombre', async () => {
    vi.mocked(getDetail).mockImplementation((n) => Promise.resolve(detail(n)))
    vi.mocked(getSpecies).mockResolvedValue({})
    const name = ref<string | undefined>('bulbasaur')

    const { status, detail: loaded } = mountLoader(name)
    await vi.waitFor(() => expect(status.value).toBe('ready'))
    expect(loaded.value?.displayName).toBe('bulbasaur')

    name.value = 'ivysaur'
    await vi.waitFor(() => expect(loaded.value?.displayName).toBe('ivysaur'))
  })
})
