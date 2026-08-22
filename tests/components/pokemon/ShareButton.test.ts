import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ShareButton from '@/components/pokemon/ShareButton.vue'
import type { PokemonDetail } from '@/types/domain'

const bulbasaur: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  displayName: 'Bulbasaur',
  number: 'Nº001',
  artworkUrl: '1.png',
  types: ['grass', 'poison'],
  weightKg: 6.9,
  heightM: 0.7,
  abilities: ['Overgrow'],
  stats: [],
  category: 'Semilla',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ShareButton', () => {
  it('copia el texto armado y confirma visualmente (CA-07.1, CA-07.3)', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const wrapper = mount(ShareButton, { props: { detail: bulbasaur } })
    await wrapper.find('button').trigger('click')
    await Promise.resolve()
    await Promise.resolve()

    expect(writeText).toHaveBeenCalledWith(
      'Bulbasaur, Nº001, Planta, Veneno, 6,9 kg, 0,7 m, Semilla, Overgrow',
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('¡Copiado!')
  })

  it('informa el error si no se pudo copiar (CA-07.4)', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = vi.fn().mockReturnValue(false)

    const wrapper = mount(ShareButton, { props: { detail: bulbasaur } })
    await wrapper.find('button').trigger('click')
    await Promise.resolve()
    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('No se pudo copiar')
  })
})
