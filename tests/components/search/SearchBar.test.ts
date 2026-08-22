import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SearchBar from '@/components/search/SearchBar.vue'
import { useUiStore } from '@/stores/useUiStore'

beforeEach(() => {
  vi.useFakeTimers()
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SearchBar', () => {
  it('no escribe en el store hasta que pasan 250ms sin tipear (CA-03.2)', async () => {
    const wrapper = mount(SearchBar)
    const uiStore = useUiStore()
    const input = wrapper.find('input')

    await input.setValue('char')
    expect(uiStore.query).toBe('')

    await vi.advanceTimersByTimeAsync(200)
    expect(uiStore.query).toBe('')

    await vi.advanceTimersByTimeAsync(50)
    expect(uiStore.query).toBe('char')
  })

  it('cada tecla reinicia el debounce', async () => {
    const wrapper = mount(SearchBar)
    const uiStore = useUiStore()
    const input = wrapper.find('input')

    await input.setValue('c')
    await vi.advanceTimersByTimeAsync(200)
    await input.setValue('ch')
    await vi.advanceTimersByTimeAsync(200)

    expect(uiStore.query).toBe('')

    await vi.advanceTimersByTimeAsync(50)
    expect(uiStore.query).toBe('ch')
  })

  it('muestra el botón de filtro por defecto y lo puede ocultar (desktop)', () => {
    const withFilter = mount(SearchBar)
    expect(withFilter.find('.search-bar__filter').exists()).toBe(true)

    const withoutFilter = mount(SearchBar, { props: { showFilterButton: false } })
    expect(withoutFilter.find('.search-bar__filter').exists()).toBe(false)
  })

  it('emite toggle-filter al click del botón de filtro', async () => {
    const wrapper = mount(SearchBar)

    await wrapper.find('.search-bar__filter').trigger('click')

    expect(wrapper.emitted('toggle-filter')).toHaveLength(1)
  })
})
