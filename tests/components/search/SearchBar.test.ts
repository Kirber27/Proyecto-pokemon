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

  // Regresión: la lupa se encimaba con el placeholder porque el padding-left venía
  // de `.search-bar__input :deep(.app-input)`, y ambas clases viven en el MISMO
  // <input> — un descendiente de sí mismo nunca hace match. El padding solo se
  // aplica mientras el input siga anidado dentro de .search-bar__field.
  it('mantiene la lupa y el input dentro del contenedor que aplica el padding', () => {
    const wrapper = mount(SearchBar)

    const field = wrapper.find('.search-bar__field')
    expect(field.exists()).toBe(true)
    expect(field.find('.search-bar__icon').exists()).toBe(true)

    const input = field.find('input.app-input')
    expect(input.exists()).toBe(true)
    // El input es descendiente del contenedor, no el contenedor mismo.
    expect(input.element).not.toBe(field.element)
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
