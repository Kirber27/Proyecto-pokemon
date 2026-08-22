import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FavoriteButton from '@/components/pokemon/FavoriteButton.vue'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('FavoriteButton', () => {
  it('arranca sin presionar y con aria-label de añadir', () => {
    const wrapper = mount(FavoriteButton, { props: { pokemonId: 1 } })

    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(wrapper.attributes('aria-label')).toBe('Añadir a favoritos')
  })

  it('al hacer click togglea el estado y el aria-pressed/aria-label', async () => {
    const wrapper = mount(FavoriteButton, { props: { pokemonId: 1 } })

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Quitar de favoritos')
    expect(wrapper.classes()).toContain('favorite-button--active')

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-pressed')).toBe('false')
  })

  it('refleja el estado ya guardado en el store para ese id', () => {
    const wrapperA = mount(FavoriteButton, { props: { pokemonId: 1 } })
    const wrapperB = mount(FavoriteButton, { props: { pokemonId: 2 } })

    expect(wrapperA.attributes('aria-pressed')).toBe('false')
    expect(wrapperB.attributes('aria-pressed')).toBe('false')
  })
})
